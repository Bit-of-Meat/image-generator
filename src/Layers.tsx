import { Dispatch, SetStateAction, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { open } from "@tauri-apps/api/dialog";

import Error from "./Error";

import layer from './l';
import { readdir, readtextfile, writefile } from "./util";
import { basename } from "@tauri-apps/api/path";

type IProps = {
    layersDirectory: string,
    setLayersDirectory: Dispatch<SetStateAction<string>>
    layers: layer[],
    setLayers: Dispatch<SetStateAction<layer[]>>
}

export default function Layers({layers, setLayers, layersDirectory, setLayersDirectory}: IProps) {
    //const [layers, setLayers] = useState<FileEntry[]>([]);

    let [errorContent, setErrorContent] = useState("")

    /**
     * Handle function for DragDropContext, which update layers order.
     */
    function OnDragEnd(result: DropResult) {
        if (!result.destination) return;

        const items = Array.from(layers);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setLayers(items);
    }

    /**
     * Handle function for "Import Layers" button, which open a directory selection dialog,
     * 
     * then get all directories in selected if "layers.json" file not exist, or load directories from "layers.json".
     */
    async function ImportLayers() {
        let dialogDir = await open({ directory: true }) as string;
        setLayersDirectory(dialogDir);

        let dirs = await readdir(dialogDir);

        try {
            let content = await readtextfile(`${dialogDir}\\layers.json`);
            setLayers(JSON.parse(content));
        } catch {
            let layers: layer[] = [];
            for (var i = 0; i < dirs.length; i++) {
                layers.push({ name: await basename(dirs[i]), path: dirs[i], rare: 100})
            }
            setLayers(layers);
        }
    }

    /**
     * Save layers order to layers.json file.
     */
    async function SaveLayersOrder() {
        if (!layersDirectory) return setErrorContent("You don't select layers directory");
        await writefile(JSON.stringify(layers, null, '\t'), `${layersDirectory}\\layers.json`);
    }

    return (
        <div className="flex flex-col text-center h-screen p-8 w-72">
            <Error content={errorContent} setContent={setErrorContent} />
            <h2 className="text-lg">Layers</h2>
            <DragDropContext onDragEnd={OnDragEnd}>
                <Droppable droppableId="layers">
                    {provided => (
                        <div className="layers grow flex flex-col text-left mb-8 overflow-auto" {...provided.droppableProps} ref={provided.innerRef}>
                            {layers.map(({name, rare}, index) => {
                                return (
                                    <Draggable key={name} draggableId={name!} index={index}>
                                        {(provided) => (
                                            <div className="mb-3 py-2 px-6 bg-gray rounded-lg" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                {name}
                                                <input className="text-black float-right w-10" type="text" onChange={e => {
                                                    let newLayers = Array.from(layers);
                                                    newLayers[index].rare = parseInt(e.target.value);
                                                    setLayers(newLayers);
                                                }} value={rare}></input>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <button className="mb-4" onClick={ImportLayers}>Import Layers</button>
            <button onClick={SaveLayersOrder}>Save Layers Order</button>
        </div>
    )
}
