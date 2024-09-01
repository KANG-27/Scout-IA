import  { FC } from "react";

interface GraphicsProps {
    predictions: Prediction[];
}

interface Prediction {
    probability: number;
    className: string;
    bbox?: number[];

  }


const Graphics: FC<GraphicsProps> = ({predictions}) => {
    return(
        <div>
            <p className='mb-5'>Posibles Objetos</p>
            {predictions.length > 0 && (
                <ul>
                  {predictions.map((p, index) => (
                    <li key={index}>{`${p.className}: ${(p.probability * 100).toFixed(2)}%`}</li>
                  ))}
                </ul>
            )}
        </div>
    )
}
export default Graphics