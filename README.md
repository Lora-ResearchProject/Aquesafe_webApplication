# Aquesafe_webApplication

 The Aquesafe Web Application is an integrated platform designed to address the unique challenges faced by small fishing vessels, particularly those operating in remote and resource-constrained maritime environments. By leveraging advanced technologies such as LoRa, the platform provides real-time tracking, long-range communication, and actionable data insights to enhance maritime safety, operational efficiency, and regulatory compliance. With a focus on affordability, low-power consumption, and user-friendly tools, Aquesafe empowers small-scale fishers to access critical information for safe and efficient operations, bridging the technological gap and promoting sustainable fishing practices.

---

# Features

 - Implement GPS-Based Vessel Location Tracking and Visualization
 - Process Data from Onboard Nodes to Generate Accurate Fishing Boat Route Records
 - Optimize LoRa Data Transmission for Secure and Efficient Long-Range Delivery
 - Supply Essential Data to Onboard Nodes to Support Critical Functions
 - Manage Emergency Alerts and Implement a Real-Time Chat System
 - Monitor the LoRa Gateway to Ensure Reliable Data Transmission and Network Performance

---

# Installation

## Locally setup 

 - Get a git clone using `https://github.com/Lora-ResearchProject/Aquesafe_webApplication.git`
 - Navigate to the root directory (Aquesafe_webApplication)
 
#### Frontend and Backend setup

 - run `npm run install-all`(For install all the dependensies in the Frontend and Backend).
 - To run this project, use the command `npm start` in the root directory.

## Run Docker file

 - pending

---

# API Request and Response body Structure (gateway and server)

## Overview
 This section outlines the structure of the request and response payloads for various operations handled by the gateway and server. Each section defines the fields and their corresponding purposes, along with examples of incoming and outgoing messages for clarity.


## Request and Response Structures

### **1. Location**
Handles incoming location updates.

#### **Request Structure**
```json
{
    "id": "vesselid-messageid",
    "l": "latitude-longitude"
}
```
- **`id`**: A unique identifier combining the vessel ID and message ID. Use `0000` for no message ID.
- **`l`**: Location in latitude-longitude format.

#### **Example Request**
```json
{
    "id": "123-0000",
    "l": "80.12321-13.32432"
}
```


### **2. SOS**
Indicates an SOS alert from a vessel.

#### **Request Structure**
```json
{
    "id": "vesselid-messageid",
    "l": "latitude-longitude",
    "s": "y"
}
```
- **`id`**: Unique identifier for the vessel and message.
- **`l`**: Location in latitude-longitude format.
- **`s`**: Boolean indicating an SOS alert (`"y"` for yes).

#### **Example Request**
```json
{
    "id": "123-0000",
    "l": "80.12321-13.32432",
    "s": "y"
}
```


### **3. Chat**
Handles incoming and outgoing messages between vessels.

#### **Incoming Message Structure**
```json
{
    "id": "vesselid-messageid",
    "m": "message_number"
}
```
- **`id`**: Identifier for the vessel and the message.
- **`m`**: Message payload as a number.

#### **Outgoing Message Structure**
```json
{
    "id": "vesselid-messageid",
    "m": "response_message_number"
}
```

#### **Example**
**Incoming Message:**
```json
{
    "id": "123-1234",
    "m": "3"
}
```

**Outgoing Message:**
```json
{
    "id": "123-A234",
    "m": "4"
}
```


### **4. Weather**
Provides weather information for a location.

#### **Outgoing Message Structure**
```json
{
    "id": "vesselid-messageid",
    "w": "weather_percentage"
}
```
- **`id`**: Identifier for the vessel and message.
- **`w`**: Weather information as a percentage between 0 and 100.

#### **Example**
```json
{
    "id": "123-0000",
    "w": "60"
}
```


### **5. Fishing Hotspots**
Manages requests and responses related to fishing hotspots.

#### **Incoming Message (Get Fishing Location)**
```json
{
    "id": "vesselid-messageid",
    "l": "latitude-longitude",
    "f": "1"
}
```
- **`id`**: Unique identifier.
- **`l`**: Location in latitude-longitude format.
- **`f`**: `1` to request a fishing location.

#### **Incoming Message (Request Nearest Fishing Location)**
```json
{
    "id": "vesselid-messageid",
    "l": "latitude-longitude",
    "f": "2"
}
```
- **`f`**: `2` to request the nearest fishing location.

#### **Outgoing Message (Return Nearest Fishing Location)**
```json
{
    "id": "vesselid-messageid",
    "l": "latitude-longitude",
    "f": "2"
}
```
- **`f`**: `2` indicating the response with the nearest fishing location.

#### **Examples**
**Incoming Message (Get Fishing Location):**
```json
{
    "id": "123-0000",
    "l": "80.12321-13.32432",
    "f": "1"
}
```

**Incoming Message (Request Nearest Fishing Location):**
```json
{
    "id": "123-0000",
    "l": "80.12321-13.32432",
    "f": "2"
}
```

**Outgoing Message (Return Nearest Fishing Location):**
```json
{
    "id": "123-0000",
    "l": "80.12321-13.32432",
    "f": "2"
}
```


## Field Descriptions

| Field  | Description                                                                 | Example                      |
|--------|-----------------------------------------------------------------------------|------------------------------|
| `id`   | Unique identifier combining vessel ID and message ID (e.g., `123-0000`).    | `"123-0000"`                |
| `l`    | Location in latitude-longitude format.                                      | `"80.12321-13.32432"`       |
| `s`    | SOS alert flag (`"y"` for yes).                                             | `"y"`                       |
| `m`    | Message payload as a number.                                               | `"3"`                       |
| `w`    | Weather information as a percentage between 0 and 100.                     | `"60"`                      |
| `f`    | Fishing hotspot actions (`1`, `2`, or `3`).                                 | `"2"`                       |

---

# Vessel Authentication API Documentation

## 1. Vessel Registration

### Endpoint  
```
POST http://localhost:3001/api/vessel-auth/vessel-register  
``` 

### Request Body  
``` 
{
  "vesselName": "vessel 001",
  "email": "ss002@gmail.com",
  "password": "1234"
}  
``` 

### Response  
```
{
  "message": "Vessel registered successfully"
}  
``` 

---

## 2. Vessel Login

### Endpoint  
``` 
POST http://localhost:3001/api/vessel-auth/vessel-login  
``` 

### Request Body  
``` 
{
  "email": "ss002@gmail.com",
  "password": "1234"
}  
```

### Response  
```
{
  "vesselId": "002",
  "message": "Login successful"
}  
```

---