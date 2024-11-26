import React, { useRef, useState } from "react";
import axios from 'axios'
import config from '../../config.js'
import "bootstrap/dist/css/bootstrap.min.css"; // Импортируем стили Bootstrap
import "./SignaturePad.css"

const SignaturePad = ({ imageName, title, student, numberOfComponent, setNumberOfComponent }) => {
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
  const sauvegarderSignature = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL(); // Получаем изображение в формате base64
    const link = document.createElement("a");
    link.href = dataUrl;

    // Constitution du corps de notre requête
    const signatureData = {
      imageBase64: dataUrl,
      fileName: imageName
    }

    // Envoi des données à l'API avec axios
    try {
      const response = await axios.post(`${config.apiBaseUrl}/document/uploadOneDocument/${student.id}`, signatureData, {
        headers: {
          'Content-Type': 'application/json', // Définir le type de contenu comme JSON
        }
      })
      // console.log('Signature envoyée avec succès :', response.data)
      setNumberOfComponent(numberOfComponent + 1)
    } catch(error) {
      console.log(error)
    }
  }

  // Инициализация при рендере
  React.useEffect(() => {
    initialiserCanevas();
  }, []);


  // AVERTISSEMENT : si on déploie le backend sur un serveur distant, il faudra 
  // adapter l'URL pour pointer vers le bon domaine (au lieu de localhost)!

  return (
    <div className="container mt-1 pad-container">
      <h2 className="text-center pad-title">{title}</h2>
      <div className="text-center pad-responsive-design">
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
      <div className="d-flex justify-content-center pad-buttons">
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

export default SignaturePad;
