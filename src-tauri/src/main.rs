#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::{
  fs::{read_dir, metadata, read_to_string, write},
  path::Path
};

use image::{imageops::{FilterType}, GenericImageView};

#[tauri::command]
fn writefile(contents: String, dir: String) {
  write(dir, contents).unwrap();
}

#[tauri::command]
fn readtextfile(dir: String) -> Result<String, String> {
  let contents = read_to_string(dir);
    match contents {
      Ok(s) => Ok(s),
      Err(s) => Err(s.to_string())
    }
}

#[tauri::command]
fn readdir(dir: String) -> Vec<String> {
  let md = metadata(&dir).unwrap();
  let mut names = Vec::new();

  if md.is_dir() {
    let paths = read_dir(&dir).unwrap();
    
    names = paths.filter_map(|entry| {
      entry.ok().and_then(|e|
        e.path().to_str().map(|n| String::from(n))
      )
    }).collect::<Vec<String>>();
  }

  names
}

#[tauri::command]
fn merge_images(images: Vec<String>, output_file: String) {
  let mut first = image::open(&Path::new(&images[0])).ok().expect("Opening image failed");
  let (width, height) = first.dimensions();

  for image in &images {
    let img = image::open(&Path::new(&image)).ok().expect("Opening image failed");
    image::imageops::overlay(&mut first, &img, 0, 0);
  }
  first.resize(width * 4, height * 4, FilterType::Nearest).save(&output_file).unwrap()
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![readdir, readtextfile, writefile, merge_images])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
