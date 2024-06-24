// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate rosc;

use tauri::Manager;
use serde_json::{Value, Error};
use rosc::{encoder, OscType};
use rosc::{OscMessage, OscPacket};
use std::net::UdpSocket;
use std::sync::{Arc, Mutex};

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let sock = Arc::new(Mutex::new(UdpSocket::bind("127.0.0.1:33833").unwrap()));
            let sock_clone = Arc::clone(&sock);
            let listen_global: tauri::EventHandler = app.listen_global("event-name", move |event| {
                if let Some(payload) = event.payload() {
                    match serde_json::from_str::<Value>(payload) {
                        Ok(v) => {
                            let host = v["host"].as_str().unwrap_or("127.0.0.1");
                            let port = v["port"].as_u64().unwrap_or(8888);
                            let address = v["address"].as_str().unwrap_or("/popeye");
                            let args = match v["args"].as_array() {
                                Some(arr) => arr.iter()
                                    .filter_map(|val| val.as_f64().map(|f| f as f32))
                                    .collect::<Vec<f32>>(),
                                None => vec![],
                            };
                            let destination = format!("{}:{}", host, port);

                            let msg_buf = encoder::encode(&OscPacket::Message(OscMessage {
                                addr: address.to_string(),
                                args: args.iter().map(|&f| OscType::Float(f)).collect(),
                            }))
                            .unwrap();
                            let sock = sock_clone.lock().unwrap();
                            if let Err(e) = sock.send_to(&msg_buf, &destination) {
                                eprintln!("Failed to send OSC message: {}", e);
                            }
                        }
                        Err(e) => {
                            eprintln!("Failed to parse JSON payload: {}", e);
                        }
                    }
                } else {
                    eprintln!("No payload in event");
                }
            });
            // app.unlisten(id);
            // app.emit_all("event-name", Payload { message: "Tauri is awesome!".into() }).unwrap();

            let window = app.get_window("main").unwrap();
            #[cfg(debug_assertions)]
            {
                window.open_devtools();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
