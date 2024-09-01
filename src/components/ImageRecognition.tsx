"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import Graphics from './Graphics';

interface Prediction {
    probability: number;
    className: string;
    bbox?: number[];

  }
  
const ImageRecognition = () => {
  
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(false);
  
  // Configurar el backend al montar el componente
    useEffect(() => {
      tf.setBackend('webgl').then(() => {
        console.log('Backend establecido en WebGL');
      }).catch(err => {
        console.error('Error al establecer el backend:', err);
      });
    }, []);

    const loadAndPredict = async () => {
      setLoading(true);

      // Cargar el modelo pre-entrenado MobileNet
      try{
        const model = await cocoSsd.load();
        const modelmobile = await mobilenet.load();
        console.log('Modelo COCO SSD cargado');
        
        // Hacer predicciones
        if (imageRef.current) {
            const predict = await model.detect(imageRef.current);
            const predictions = await modelmobile.classify(imageRef.current);
            const unifiedPredictions = [
              ...predictions.map(p => ({
                className: p.className,
                probability: p.probability
              })),
              ...predict.map(p => ({
                className: p.class,
                probability: p.score,
                bbox: p.bbox
              }))
            ]
            // Ordenar por probabilidad de mayor a menor
            const sortedPredictions = unifiedPredictions.sort((a, b) => b.probability - a.probability);
            setPredictions(sortedPredictions)
        }
      }catch(error){
        console.log('Error al cargar el modelo o hacer la predicción:', error)
      }finally{
        setLoading(false);
      }
        
    }
    
    // Dibujar los resultados en el canvas
    useEffect(()=>{
      if(predictions.length > 0 && canvasRef.current && imageRef.current ){
        const ctx = canvasRef.current.getContext("2d")
        console.log(ctx)
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          console.log(canvasRef.current.width, canvasRef.current.height)
          ctx.drawImage(imageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
  
          predictions.forEach((prediction) => {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 4;
            if(prediction.bbox){
              ctx.strokeRect(
                prediction.bbox[0],
                prediction.bbox[1],
                prediction.bbox[2] > 700 ? 680: prediction.bbox[2],
                prediction.bbox[3] + prediction.bbox[1] >= 700 ? 680-prediction.bbox[1]: prediction.bbox[3]
              );
              ctx.fillStyle = 'red';
              ctx.font = '18px Arial';
              ctx.fillText(
                `${prediction.className} (${(prediction.probability * 100).toFixed(4)}%)`,
                prediction.bbox[0],
                prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
              );
            }
          });
        }
      }
    }, [predictions]);


    const handeldivclick = () => {
      const inputchangeimage = document.getElementById("choseFile") 
      if(inputchangeimage){
        inputchangeimage.click();
      } 
    }

    return (
      <div className='h-[100%] flex justify-center ml-52 mr-20'>
        {loading &&
          <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-opacity-50 bg-gray-900">
            <span className="text-white text-xl">Cargando...</span>
          </div>
        }
        <div className='flex mt-5 gap-10 w-full'>
          <div className='border-2 border-white cursor-pointer rounded-2xl flex justify-center items-center' onClick={handeldivclick}>
            <span className="material-icons fixed z-10">+</span>
            <input
              type="file"
              id='choseFile'
              accept="image/*"
              className='hidden'
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
            <canvas ref={canvasRef} width="700" height="700" className='rounded-2xl brightness-50'/>
          </div>
          <div className='w-[40%]'>
            <Graphics predictions={predictions}/>
          </div>
        </div>
      </div>
    );
}
export default ImageRecognition;