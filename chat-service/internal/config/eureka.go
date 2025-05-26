package config

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

type EurekaClient struct {
	serviceURL      string
	applicationName string
	port            string
	hostName        string
	healthCheckURL  string
	statusURL       string
	homePageURL     string
}

type InstanceInfo struct {
	Instance struct {
		InstanceId       string         `json:"instanceId"`
		App              string         `json:"app"`
		AppGroupName     string         `json:"appGroupName"`
		IPAddr           string         `json:"ipAddr"`
		Port             map[string]int `json:"port"`
		SecurePort       map[string]int `json:"securePort"`
		HomePageUrl      string         `json:"homePageUrl"`
		StatusPageUrl    string         `json:"statusPageUrl"`
		HealthCheckUrl   string         `json:"healthCheckUrl"`
		VipAddress       string         `json:"vipAddress"`
		SecureVipAddress string         `json:"secureVipAddress"`
		Status           string         `json:"status"`
		DataCenterInfo   struct {
			Name string `json:"name"`
		} `json:"dataCenterInfo"`
	} `json:"instance"`
}

func NewEurekaClient() *EurekaClient {
	eurekaURL := os.Getenv("EUREKA_CLIENT_SERVICEURL_DEFAULTZONE")
	if eurekaURL == "" {
		eurekaURL = "http://localhost:8761/eureka"
	}

	hostIP := "localhost" // In production, get actual IP
	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}

	return &EurekaClient{
		serviceURL:      eurekaURL,
		applicationName: "CHAT-SERVICE",
		port:            port,
		hostName:        hostIP,
		healthCheckURL:  fmt.Sprintf("http://%s:%s/health", hostIP, port),
		statusURL:       fmt.Sprintf("http://%s:%s/health/info", hostIP, port),
		homePageURL:     fmt.Sprintf("http://%s:%s/", hostIP, port),
	}
}

func (ec *EurekaClient) Register() error {
	hostIP := "localhost" // In production, get actual IP

	instance := InstanceInfo{}
	instance.Instance.InstanceId = fmt.Sprintf("%s:%s:%s", hostIP, ec.applicationName, ec.port)
	instance.Instance.App = ec.applicationName
	instance.Instance.IPAddr = hostIP
	instance.Instance.Port = map[string]int{"$": 8084}
	instance.Instance.SecurePort = map[string]int{"$": 443}
	instance.Instance.HomePageUrl = fmt.Sprintf("http://%s:%s/", hostIP, ec.port)
	instance.Instance.StatusPageUrl = fmt.Sprintf("http://%s:%s/info", hostIP, ec.port)
	instance.Instance.HealthCheckUrl = fmt.Sprintf("http://%s:%s/health", hostIP, ec.port)
	instance.Instance.VipAddress = ec.applicationName
	instance.Instance.SecureVipAddress = ec.applicationName
	instance.Instance.Status = "UP"
	instance.Instance.DataCenterInfo.Name = "MyOwn"

	jsonData, err := json.Marshal(instance)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/apps/%s", ec.serviceURL, ec.applicationName)
	req, err := http.NewRequest("POST", url, strings.NewReader(string(jsonData)))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to register with Eureka. Status: %d", resp.StatusCode)
	}

	go ec.StartHeartbeat(context.Background())
	return nil
}

func (ec *EurekaClient) StartHeartbeat(ctx context.Context) {
	ticker := time.NewTicker(30 * time.Second)
	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				if err := ec.sendHeartbeat(); err != nil {
					log.Printf("Failed to send heartbeat: %v", err)
				}
			}
		}
	}()
}

func (ec *EurekaClient) sendHeartbeat() error {
	hostIP := "localhost"
	url := fmt.Sprintf("%s/apps/%s/%s:%s:%s",
		ec.serviceURL,
		ec.applicationName,
		hostIP,
		ec.applicationName,
		ec.port)

	req, err := http.NewRequest("PUT", url, nil)
	if err != nil {
		return err
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to send heartbeat. Status: %d", resp.StatusCode)
	}

	return nil
}

func (ec *EurekaClient) Deregister() error {
	hostIP := "localhost"
	url := fmt.Sprintf("%s/apps/%s/%s:%s:%s",
		ec.serviceURL,
		ec.applicationName,
		hostIP,
		ec.applicationName,
		ec.port)

	req, err := http.NewRequest("DELETE", url, nil)
	if err != nil {
		return err
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to deregister. Status: %d", resp.StatusCode)
	}

	return nil
}
