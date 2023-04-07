import { ChangeEventHandler, useEffect, useState } from "react";

function useDragEnterHook() {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const listenDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDragging(true);
      }
    };
    window.addEventListener("dragenter", listenDragEnter);
    return () => window.removeEventListener("dragenter", listenDragEnter);
  }, []);

  return [isDragging, () => setIsDragging(false)] as const;
}

export const ModelInput: React.FC<{
  ext: string | string[];
  onDropArrayBuffer?: (ext: string, arrayBuffer: ArrayBuffer) => void;
  onDropText?: (ext: string, text: string) => void;
}> = ({ onDropArrayBuffer, onDropText, ext }) => {
  const [isDragging, cancel] = useDragEnterHook();
  const extArray = Array.isArray(ext)
    ? ext
    : ext.includes(" ")
    ? ext.split(" ")
    : [ext];

  const onChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    cancel();
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop();
      if (!ext) return;
      if (!extArray.includes(ext)) return;

      if (onDropArrayBuffer) {
        const ab = await convertFileToArrayBuffer(file);
        onDropArrayBuffer(ext, ab);
      }
      if (onDropText) {
        const text = await file.text();
        onDropText(ext, text);
      }
    }
  };
  const inputElement = (
    <input
      type="file"
      accept={extArray.map((ext) => `.${ext}`).join(",")}
      style={
        isDragging
          ? {
              background: "white",
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 1,
              width: "100vw",
              height: "100vh",
            }
          : {}
      }
      onChange={onChange}
    ></input>
  );

  if (isDragging) {
    return (
      <div className="w-full h-full absolute top-0 left-0 z-full bg-white opacity-80">
        {inputElement}
      </div>
    );
  }
  return inputElement;
};

function convertFileToArrayBuffer(file: File) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      const result = e.target?.result;
      if (!(result instanceof ArrayBuffer)) {
        reject(new Error("result is not ArrayBuffer"));
        return;
      }
      resolve(result);
    });
    reader.readAsArrayBuffer(file);
  });
}
