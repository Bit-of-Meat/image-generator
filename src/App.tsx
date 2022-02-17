import { useState } from "react";

import Layers from "./Layers";
import Properties from "./Properties";
import Error from "./Error";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import layer from "./l";
import {readdir} from "./util";

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Merge passed image in one and save it to outputFile
 * @param images - path array in render order
 * @param outputFile - full file name result
 */
function MergeImages(images: string[], outputFile: string) {
  invoke('merge_images', { images, outputFile })
}

export default function App() {
  const [errorContent, setErrorContent] = useState("")

  // Properties component
  const [outputDir, setOutputDir] = useState("")
  const [count, setCount] = useState(1)
  const [enabled, setEnabled] = useState(false)

  //Layers component
  const [layersDirectory, setLayersDirectory] = useState("");
  const [layers, setLayers] = useState<layer[]>([]);

  const [img, setImg] = useState("");

  async function ShowPreview() {
    if (!layersDirectory) return setErrorContent("You don't select layers directory")
    if (!outputDir) return setErrorContent("You don't select output directory")

    let paths: string[] = [];
    
    for (var b = 0; b < layers.length; b++) {
      let layer = layers[b];

      let files = await readdir(layer.path);
      let file = files[getRandomInt(0, files.length - 1)];
      if (layer.rare >= getRandomInt(0, 100)) paths.push(file);
    }

    MergeImages(paths, `${outputDir}\\preview.png`);
    setImg(convertFileSrc(`${outputDir}\\preview.png`));
  }

  async function Generate() {
    if (!layersDirectory) return setErrorContent("You don't select layers directory")
    if (!outputDir) return setErrorContent("You don't select output directory")

    for (var i = 1; i < count + 1; i++) {
      let paths: string[] = [];
      
      for (var b = 0; b < layers.length; b++) {
        let layer = layers[b];

        let files = await readdir(layer.path);
        let file = files[getRandomInt(0, files.length - 1)];
        if (file && layer.rare >= getRandomInt(0, 100)) paths.push(file);
      }
      console.log(paths);

      MergeImages(paths, `${outputDir}\\${i}.png`);
    }
  }

  return (
    <div className="flex">
      <Error content={errorContent} setContent={setErrorContent} />
      <Layers layersDirectory={layersDirectory} setLayersDirectory={setLayersDirectory} layers={layers} setLayers={setLayers}/>
      <div className="preview grow flex flex-col p-8">
        <img alt="preview" style={ enabled ? { imageRendering: "pixelated"} : { imageRendering: "auto" } } src={img} className="grow object-contain" />
        <div className="flex">
          <button onClick={ShowPreview}>Preview</button>
          <button onClick={Generate}>Generate</button>
        </div>
      </div>
      <Properties count={count} setCount={setCount} outputDir={outputDir} setOutputDir={setOutputDir} enabled={enabled} setEnabled={setEnabled} />
    </div>
  )
}