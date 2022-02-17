import { Dispatch, SetStateAction, useState } from 'react'
import { Listbox, Switch } from '@headlessui/react'
import { open } from '@tauri-apps/api/dialog'

const method = ["Random", "Combination"]

type IProps = {
    outputDir: string,
    setOutputDir: Dispatch<SetStateAction<string>>,
    count: number,
    setCount: Dispatch<SetStateAction<number>>,
    enabled: boolean,
    setEnabled: Dispatch<SetStateAction<boolean>>
}

export default function Properties({count, setCount, outputDir, setOutputDir, enabled, setEnabled}: IProps) {
    const [selectedPerson, setSelectedPerson] = useState(method[0])

    async function SelectOutputDirectory() {
        let dir = await open({ directory: true }) as string;
        setOutputDir(dir);
    }

    return (
        <div>
            <h2 className="text-lg">Properties</h2>
            <button onClick={SelectOutputDirectory}>Select Output Directory</button>
            <div className='flex'>
                <button onClick={() => { if (count > 1) setCount(count - 1)}}>-</button>
                <div className='text-white'>{count}</div>
                <button onClick={() => { setCount(count + 1)}}>+</button>
            </div>
            <Switch checked={enabled} onChange={setEnabled} className={`${enabled ? 'bg-blue' : 'bg-gray'} inline-flex p-2 w-16 rounded-full cursor-pointer transition-colors ease-in-out duration-200`}>
                <span className={`${enabled ? 'translate-x-7' : 'translate-x-0'} h-5 w-5 rounded-full bg-white transform transition ease-in-out duration-200`}/>
            </Switch>
            <br />
            <Listbox value={selectedPerson} onChange={setSelectedPerson}>
                <Listbox.Button>{selectedPerson}</Listbox.Button>
                <Listbox.Options>
                    {method.map((name, index) => (
                        <Listbox.Option key={index} value={name}>
                            {name}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
        </div>
    )
}