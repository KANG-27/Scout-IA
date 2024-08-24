"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';

interface Prediction {
    className: string;
    probability: number;
  }
  

const ImageRecognition = () => {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const imageRef = useRef<HTMLImageElement>(null);

  // Configurar el backend al montar el componente
  useEffect(() => {
    tf.setBackend('webgl').then(() => {
      console.log('Backend establecido en WebGL');
    }).catch(err => {
      console.error('Error al establecer el backend:', err);
    });
  }, []);

    const loadAndPredict = async () => {
        // Cargar el modelo pre-entrenado MobileNet
        const model = await mobilenet.load();
        // Hacer predicciones
        if (imageRef.current) {
            const predict = await model.classify(imageRef.current);
            setPredictions(predict)
        }
    }


    return (
        <div className='flex flex-col gap-5'>
            <span>Reconocer objeto</span>
            <input type="file" accept='image/*' 
                onChange={(e) => {
                    // Verificar que e.target.files no es null y tiene al menos un archivo
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
            <img ref={imageRef} alt="Subida"/>
            <button onClick={loadAndPredict}>Predecir imagen</button>
            <ul>
                {predictions.map((p,index)=>(
                    <li key={index}>{`${p.className}: ${p.probability.toFixed(2)}`}</li>
                ))}
            </ul>
        </div>
    )
}
export default ImageRecognition;