package logger

import (
	"log"
	"os"
	"runtime"
	"strings"
)

// Logger levels
const (
	DEBUG = "DEBUG"
	INFO  = "INFO"
	WARN  = "WARN"
	ERROR = "ERROR"
	FATAL = "FATAL"
)

type Logger struct {
	debugLogger *log.Logger
	infoLogger  *log.Logger
	warnLogger  *log.Logger
	errorLogger *log.Logger
	fatalLogger *log.Logger
	level       string
}

var DefaultLogger *Logger

func init() {
	DefaultLogger = NewLogger()
}

func NewLogger() *Logger {
	level := os.Getenv("LOG_LEVEL")
	if level == "" {
		level = INFO
	}

	return &Logger{
		debugLogger: log.New(os.Stdout, "[DEBUG] ", log.LstdFlags|log.Lshortfile),
		infoLogger:  log.New(os.Stdout, "[INFO] ", log.LstdFlags),
		warnLogger:  log.New(os.Stdout, "[WARN] ", log.LstdFlags),
		errorLogger: log.New(os.Stderr, "[ERROR] ", log.LstdFlags|log.Lshortfile),
		fatalLogger: log.New(os.Stderr, "[FATAL] ", log.LstdFlags|log.Lshortfile),
		level:       strings.ToUpper(level),
	}
}

func (l *Logger) shouldLog(level string) bool {
	levels := map[string]int{
		DEBUG: 0,
		INFO:  1,
		WARN:  2,
		ERROR: 3,
		FATAL: 4,
	}

	currentLevel := levels[l.level]
	targetLevel := levels[level]
	
	return targetLevel >= currentLevel
}

func (l *Logger) Debug(v ...interface{}) {
	if l.shouldLog(DEBUG) {
		l.debugLogger.Println(v...)
	}
}

func (l *Logger) Debugf(format string, v ...interface{}) {
	if l.shouldLog(DEBUG) {
		l.debugLogger.Printf(format, v...)
	}
}

func (l *Logger) Info(v ...interface{}) {
	if l.shouldLog(INFO) {
		l.infoLogger.Println(v...)
	}
}

func (l *Logger) Infof(format string, v ...interface{}) {
	if l.shouldLog(INFO) {
		l.infoLogger.Printf(format, v...)
	}
}

func (l *Logger) Warn(v ...interface{}) {
	if l.shouldLog(WARN) {
		l.warnLogger.Println(v...)
	}
}

func (l *Logger) Warnf(format string, v ...interface{}) {
	if l.shouldLog(WARN) {
		l.warnLogger.Printf(format, v...)
	}
}

func (l *Logger) Error(v ...interface{}) {
	if l.shouldLog(ERROR) {
		l.errorLogger.Println(v...)
	}
}

func (l *Logger) Errorf(format string, v ...interface{}) {
	if l.shouldLog(ERROR) {
		l.errorLogger.Printf(format, v...)
	}
}

func (l *Logger) Fatal(v ...interface{}) {
	l.fatalLogger.Println(v...)
	os.Exit(1)
}

func (l *Logger) Fatalf(format string, v ...interface{}) {
	l.fatalLogger.Printf(format, v...)
	os.Exit(1)
}

// WithContext adds context information to log messages
func (l *Logger) WithContext(context string) *ContextLogger {
	return &ContextLogger{
		logger:  l,
		context: context,
	}
}

type ContextLogger struct {
	logger  *Logger
	context string
}

func (cl *ContextLogger) Debug(v ...interface{}) {
	cl.logger.Debugf("[%s] %v", cl.context, v)
}

func (cl *ContextLogger) Debugf(format string, v ...interface{}) {
	cl.logger.Debugf("[%s] "+format, append([]interface{}{cl.context}, v...)...)
}

func (cl *ContextLogger) Info(v ...interface{}) {
	cl.logger.Infof("[%s] %v", cl.context, v)
}

func (cl *ContextLogger) Infof(format string, v ...interface{}) {
	cl.logger.Infof("[%s] "+format, append([]interface{}{cl.context}, v...)...)
}

func (cl *ContextLogger) Warn(v ...interface{}) {
	cl.logger.Warnf("[%s] %v", cl.context, v)
}

func (cl *ContextLogger) Warnf(format string, v ...interface{}) {
	cl.logger.Warnf("[%s] "+format, append([]interface{}{cl.context}, v...)...)
}

func (cl *ContextLogger) Error(v ...interface{}) {
	cl.logger.Errorf("[%s] %v", cl.context, v)
}

func (cl *ContextLogger) Errorf(format string, v ...interface{}) {
	cl.logger.Errorf("[%s] "+format, append([]interface{}{cl.context}, v...)...)
}

// Convenience functions using the default logger
func Debug(v ...interface{}) {
	DefaultLogger.Debug(v...)
}

func Debugf(format string, v ...interface{}) {
	DefaultLogger.Debugf(format, v...)
}

func Info(v ...interface{}) {
	DefaultLogger.Info(v...)
}

func Infof(format string, v ...interface{}) {
	DefaultLogger.Infof(format, v...)
}

func Warn(v ...interface{}) {
	DefaultLogger.Warn(v...)
}

func Warnf(format string, v ...interface{}) {
	DefaultLogger.Warnf(format, v...)
}

func Error(v ...interface{}) {
	DefaultLogger.Error(v...)
}

func Errorf(format string, v ...interface{}) {
	DefaultLogger.Errorf(format, v...)
}

func Fatal(v ...interface{}) {
	DefaultLogger.Fatal(v...)
}

func Fatalf(format string, v ...interface{}) {
	DefaultLogger.Fatalf(format, v...)
}

func WithContext(context string) *ContextLogger {
	return DefaultLogger.WithContext(context)
}

// LogError logs an error with stack trace information
func LogError(err error, context string) {
	if err != nil {
		_, file, line, _ := runtime.Caller(1)
		DefaultLogger.Errorf("[%s] Error at %s:%d - %v", context, file, line, err)
	}
}

// LogPanic logs a panic with stack trace
func LogPanic(r interface{}, context string) {
	_, file, line, _ := runtime.Caller(1)
	DefaultLogger.Errorf("[%s] Panic at %s:%d - %v", context, file, line, r)
}
