package service

import (
	"encoding/json"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/socialmedia/chat-service/internal/errors"
)

type MessageHandler func(WebSocketMessage) error

type WebSocket struct {
	conn           *websocket.Conn
	writeMu        sync.Mutex
	CloseChan      chan struct{}
	messageHandler MessageHandler
}

type WebSocketMessage struct {
	Type    string          `json:"type"`
	Content json.RawMessage `json:"content"`
}

func NewWebSocket(conn *websocket.Conn, handler MessageHandler) *WebSocket {
	return &WebSocket{
		conn:           conn,
		CloseChan:      make(chan struct{}),
		messageHandler: handler,
	}
}

func (ws *WebSocket) Listen() {
	defer func() {
		if r := recover(); r != nil {
			errors.LogError(errors.NewAppError(errors.InternalServerError, "WebSocket listener panicked"), "WebSocket.Listen")
		}
		ws.conn.Close()
		close(ws.CloseChan)
	}()

	for {
		_, message, err := ws.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				errors.LogError(errors.WrapError(errors.WebSocketNotConnected, err), "WebSocket.Listen - Unexpected close")
			} else {
				errors.LogInfo("WebSocket connection closed normally", "WebSocket.Listen")
			}
			break
		}

		var wsMessage WebSocketMessage
		if err := json.Unmarshal(message, &wsMessage); err != nil {
			errors.LogError(errors.WrapError(errors.InvalidWebSocketMessage, err), "WebSocket.Listen - JSON unmarshal")
			// Send error response back to client
			errorMsg := map[string]interface{}{
				"type":  "error",
				"error": "Invalid message format",
			}
			if errBytes, marshalErr := json.Marshal(errorMsg); marshalErr == nil {
				ws.SendMessage(errBytes)
			}
			continue
		}

		// Message handlers will be implemented by the chat service
		if ws.messageHandler != nil {
			if err := ws.messageHandler(wsMessage); err != nil {
				errors.LogError(err, "WebSocket.Listen - Message handler")
				// Send error response back to client
				errorMsg := map[string]interface{}{
					"type":  "error",
					"error": err.Error(),
				}
				if errBytes, marshalErr := json.Marshal(errorMsg); marshalErr == nil {
					ws.SendMessage(errBytes)
				}
			}
		}
	}
}

func (ws *WebSocket) SendMessage(message []byte) error {
	ws.writeMu.Lock()
	defer ws.writeMu.Unlock()

	if err := ws.conn.WriteMessage(websocket.TextMessage, message); err != nil {
		return errors.WrapError(errors.WebSocketNotConnected, err)
	}
	return nil
}

func (ws *WebSocket) Close() {
	close(ws.CloseChan)
	ws.conn.Close()
}
