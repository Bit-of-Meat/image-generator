import { Dialog } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

type ErrorProps = {
    content: string,
    setContent: Dispatch<SetStateAction<string>>
}

export default function Error({content, setContent}: ErrorProps) {
    return (
        <Dialog open={!!content} onClose={() => setContent("")} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

                <div className="relative bg-white rounded text-black p-4">
                    <Dialog.Title>{content}</Dialog.Title>
                </div>
            </div>
        </Dialog>
    )
}