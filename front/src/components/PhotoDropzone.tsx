import { ImagePlus, X } from 'lucide-react';
import { useEffect, useRef, useState, type DragEvent } from 'react';
import { MAX_PHOTO_BYTES, validatePhoto } from '../utils/validate';

interface Props {
  file: File | null;
  onChange: (file: File | null) => void;
}

export default function PhotoDropzone({ file, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const accept = (f: File | undefined) => {
    if (!f) return;
    const err = validatePhoto(f);
    setError(err);
    if (!err) onChange(f);
    if (input.current) input.current.value = '';
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    accept(e.dataTransfer.files[0]);
  };

  return (
    <div className="field">
      <span className="field__label">Фото (необязательно)</span>
      <div
        className={`drop${over ? ' is-over' : ''}${preview ? ' has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        {preview ? (
          <>
            <img src={preview} alt="Превью выбранного фото" />
            <button type="button" className="drop__remove icon-btn" onClick={() => { onChange(null); setError(null); }} aria-label="Убрать фото">
              <X size={18} />
            </button>
          </>
        ) : (
          <button type="button" className="drop__btn" onClick={() => input.current?.click()}>
            <ImagePlus size={28} aria-hidden="true" />
            <span>Перетащи файл сюда или нажми, чтобы выбрать</span>
            <small>JPEG, PNG, GIF, WEBP · до {MAX_PHOTO_BYTES / 1024 / 1024} МБ</small>
          </button>
        )}
        <input ref={input} type="file" accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={(e) => accept(e.target.files?.[0])} />
      </div>
      {error && <p className="field__error" role="alert">{error}</p>}
    </div>
  );
}
