// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate rosc;

use tauri::Manager;
use rosc::encoder;
use rosc::{OscMessage, OscPacket, OscType};
use std::net::{SocketAddrV4, UdpSocket};
use std::sync::{Arc, Mutex};
use std::{env, f32, thread};


// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}


fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let sock = Arc::new(Mutex::new(UdpSocket::bind("127.0.0.1:8000").unwrap()));
      let sock_clone = Arc::clone(&sock);
      let id = app.listen_global("event-name", move |event| {
        println!("got event-name with payload {:?}", event.payload());
        
        let msg_buf = encoder::encode(&OscPacket::Message(OscMessage {
          addr: "/3".to_string(),
          args: vec![],
        }))
        .unwrap();
        let sock = sock_clone.lock().unwrap();
        sock.send_to(&msg_buf, "127.0.0.1:8888").unwrap();
      });
      // app.unlisten(id);
      // app.emit_all("event-name", Payload { message: "Tauri is awesome!".into() }).unwrap();
      let window = app.get_window("main").unwrap();
      // window.open_devtools();
      Ok(())
    })  
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
