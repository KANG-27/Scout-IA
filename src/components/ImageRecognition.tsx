"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';

interface Prediction {
    class: string;
    score: number;
    bbox: number[];

  }
  

const ImageRecognition = () => {
  
    // Configurar el backend al montar el componente
    useEffect(() => {
      tf.setBackend('webgl').then(() => {
        console.log('Backend establecido en WebGL');
      }).catch(err => {
        console.error('Error al establecer el backend:', err);
      });
    }, []);

    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(false);
    

    const loadAndPredict = async () => {
      setLoading(true);

      // Cargar el modelo pre-entrenado MobileNet
      try{
        const model = await cocoSsd.load();
        console.log('Modelo COCO SSD cargado');
        
        // Hacer predicciones
        if (imageRef.current) {
            const predict = await model.detect(imageRef.current);
            setPredictions(predict)
        }
        // // Dibujar los resultados en el canvas
        if(canvasRef.current){
          const ctx = canvasRef.current.getContext('2d');
          if(ctx && imageRef.current){
            ctx.drawImage(imageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            // // Dibujar cajas alrededor de los objetos detectados
            predictions.forEach((prediction) => {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 4;
                ctx.strokeRect(
                  prediction.bbox[0],
                  prediction.bbox[1],
                  prediction.bbox[2],
                  prediction.bbox[3]
                );
                ctx.fillStyle = 'red';
                ctx.fillText(
                  `${prediction.class} (${(prediction.score * 100).toFixed(2)}%)`,
                  prediction.bbox[0],
                  prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
                );
            });
          };
        }
      }catch(error){
        console.log('Error al cargar el modelo o hacer la predicción:', error)
      }finally{
        setLoading(false);
      }
        
    }

    return (
      <div>
        {loading &&
          <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-opacity-50 bg-gray-900">
            <span className="text-white text-xl">Cargando...</span>
          </div>
        }
        <h1>Detección de Objetos</h1>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                if (imageRef.current) {
                  imageRef.current.src = event.target?.result as string;
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <img ref={imageRef} alt="Subida" style={{ display: 'none' }} onLoad={loadAndPredict} />
        <canvas ref={canvasRef} width="640" height="480" />
        {predictions.length > 0 && (
          <ul>
            {predictions.map((p, index) => (
              <li key={index}>{`${p.class}: ${(p.score * 100).toFixed(2)}%`}</li>
            ))}
          </ul>
        )}
      </div>
    );
}
export default ImageRecognition;