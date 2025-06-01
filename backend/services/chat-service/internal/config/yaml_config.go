package config

import (
	"io/ioutil"
	"log"
	"gopkg.in/yaml.v2"
)

type Config struct {
	Server struct {
		Port string `yaml:"port"`
		Host string `yaml:"host"`
	} `yaml:"server"`
	
	Database struct {
		MongoDB struct {
			URI      string `yaml:"uri"`
			Database string `yaml:"database"`
		} `yaml:"mongodb"`
	} `yaml:"database"`
	
	Security struct {
		JWT struct {
			Secret string `yaml:"secret"`
		} `yaml:"jwt"`
	} `yaml:"security"`
	
	CORS struct {
		AllowedOrigins []string `yaml:"allowed-origins"`
		AllowedMethods []string `yaml:"allowed-methods"`
		AllowedHeaders []string `yaml:"allowed-headers"`
	} `yaml:"cors"`
	
	Eureka struct {
		Server   string `yaml:"server"`
		Instance struct {
			AppName        string `yaml:"app-name"`
			InstanceID     string `yaml:"instance-id"`
			IPAddress      string `yaml:"ip-address"`
			Port           int    `yaml:"port"`
			HealthCheckURL string `yaml:"health-check-url"`
			StatusPageURL  string `yaml:"status-page-url"`
			HomePageURL    string `yaml:"home-page-url"`
		} `yaml:"instance"`
	} `yaml:"eureka"`
	
	Logging struct {
		Level string `yaml:"level"`
	} `yaml:"logging"`
}

func LoadConfig(filename string) (*Config, error) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	
	var config Config
	err = yaml.Unmarshal(data, &config)
	if err != nil {
		return nil, err
	}
	
	return &config, nil
}

// Global config instance
var AppConfig *Config

func init() {
	var err error
	AppConfig, err = LoadConfig("config.yml")
	if err != nil {
		log.Printf("Warning: Could not load config.yml, falling back to .env: %v", err)
		AppConfig = nil
	}
}
