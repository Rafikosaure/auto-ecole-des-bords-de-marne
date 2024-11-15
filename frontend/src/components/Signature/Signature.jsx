import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Импортируем стили Bootstrap

const PadDeSignature = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  // Инициализируем канвас
  const initialiserCanevas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "black"; // Цвет подписи
    ctx.lineWidth = 3; // Толщина линии
    ctx.lineJoin = "round"; // Закругленные углы
    ctx.lineCap = "round"; // Закругленные концы
    setContext(ctx);
  };

  // Начать рисование
  const commencerDessin = (e) => {
    if (context) {
      setIsDrawing(true);
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.beginPath();
    }
  };

  // Рисовать на канвасе
  const dessiner = (e) => {
    if (!isDrawing) return;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  // Прекратить рисование
  const arreterDessin = () => {
    if (context) {
      setIsDrawing(false);
      context.closePath();
    }
  };

  // Очистить канвас
  const effacerCanevas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистить канвас
  };

  // Сохранить изображение подписи
  const sauvegarderSignature = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL(); // Получаем изображение в формате base64
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "signature.png";
    link.click(); // Скачивание файла
  };

  // Инициализация при рендере
  React.useEffect(() => {
    initialiserCanevas();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Signature électronique</h2>
      <div className="text-center">
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          style={{ border: "1px solid #ccc" }}
          onMouseDown={commencerDessin}
          onMouseMove={dessiner}
          onMouseUp={arreterDessin}
          onMouseOut={arreterDessin}
        />
      </div>
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-danger me-2" onClick={effacerCanevas}>
          Effacer
        </button>
        <button className="btn btn-success" onClick={sauvegarderSignature}>
          Sauvegarder la signature
        </button>
      </div>
    </div>
  );
};

export default PadDeSignature;
