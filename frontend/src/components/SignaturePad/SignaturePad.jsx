import React, { useRef, useState } from "react";
import axios from "axios";
import config from "../../config.js";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "./SignaturePad.css";

const SignaturePad = ({ imageName, title, student, numberOfComponent, setNumberOfComponent }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  // Désactiver le scroll sur le pad (canvas)
  const disableScrollOnCanvas = (e) => {
    if (canvasRef.current && canvasRef.current.contains(e.target)) {
      e.preventDefault(); // Bloque le scrolling
    }
  };

  // Ajouter les listeners lorsque le composant est monté
  React.useEffect(() => {
    document.addEventListener("touchmove", disableScrollOnCanvas, { passive: false });
    return () => {
      document.removeEventListener("touchmove", disableScrollOnCanvas);
    };
  }, []);

  // const getTouchPos = (e) => {
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   const touch = e.touches[0];
  //   return {
  //     x: touch.clientX - rect.left,
  //     y: touch.clientY - rect.top,
  //   };
  // };

  const getTouchPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect(); // Position et taille du canvas dans le DOM
    const touch = e.touches[0];
    return {
      x: (touch.clientX - rect.left) * (canvasRef.current.width / rect.width),
      y: (touch.clientY - rect.top) * (canvasRef.current.height / rect.height),
    };
  };
  
  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect(); // Position et taille du canvas dans le DOM
    return {
      x: (e.nativeEvent.offsetX / rect.width) * canvasRef.current.width,
      y: (e.nativeEvent.offsetY / rect.height) * canvasRef.current.height,
    };
  };
  
  const startDrawing = (e) => {
    e.preventDefault();
    if (context) {
      setIsDrawing(true);
      const pos = e.type === "touchstart" ? getTouchPos(e) : getMousePos(e);
      context.moveTo(pos.x, pos.y);
      context.beginPath();
    }
  };
  
  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing || !context) return;
    const pos = e.type === "touchmove" ? getTouchPos(e) : getMousePos(e);
    context.lineTo(pos.x, pos.y);
    context.stroke();
  };

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    setContext(ctx);
  };

  // const startDrawing = (e) => {
  //   if (context) {
  //     setIsDrawing(true);
  //     const pos = e.type === "touchstart" ? getTouchPos(e) : { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  //     context.moveTo(pos.x, pos.y);
  //     context.beginPath();
  //   }
  // };

  // const draw = (e) => {
  //   if (!isDrawing || !context) return;
  //   const pos = e.type === "touchmove" ? getTouchPos(e) : { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  //   context.lineTo(pos.x, pos.y);
  //   context.stroke();
  // };

  const stopDrawing = (e) => {
    e.preventDefault();
    if (context) {
      setIsDrawing(false);
      context.closePath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    const signatureData = {
      imageBase64: dataUrl,
      fileName: imageName,
    };

    try {
      const response = await axios.post(`${config.apiBaseUrl}/document/uploadOneDocument/${student.id}`, signatureData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setNumberOfComponent(numberOfComponent + 1);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    initializeCanvas();
  }, []);

  return (
    <div className="container mt-1 pad-container">
      <h2 className="text-center pad-title">{title}</h2>
      <div className="text-center pad-responsive-design">
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          style={{ border: "1px solid #ccc" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="d-flex justify-content-center pad-buttons">
        <button className="btn btn-danger me-2" onClick={clearCanvas}>
          Effacer
        </button>
        <button className="btn btn-success" onClick={saveSignature}>
          Sauvegarder la signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
