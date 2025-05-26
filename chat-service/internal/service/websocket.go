package service

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gorilla/websocket"
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
		ws.conn.Close()
		close(ws.CloseChan)
	}()

	for {
		_, message, err := ws.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		var wsMessage WebSocketMessage
		if err := json.Unmarshal(message, &wsMessage); err != nil {
			log.Printf("error unmarshaling message: %v", err)
			continue
		}

		// Message handlers will be implemented by the chat service
		if ws.messageHandler != nil {
			if err := ws.messageHandler(wsMessage); err != nil {
				log.Printf("error handling message: %v", err)
			}
		}
	}
}

func (ws *WebSocket) SendMessage(message []byte) error {
	ws.writeMu.Lock()
	defer ws.writeMu.Unlock()

	return ws.conn.WriteMessage(websocket.TextMessage, message)
}

func (ws *WebSocket) Close() {
	close(ws.CloseChan)
	ws.conn.Close()
}
