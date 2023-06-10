import React, { useEffect } from 'react';
import { useState } from 'react';


export default function GetData() {
    const  [data,setData] = useState([]);
    const [err,setError] = useState("");
    useEffect(async ()=>{
        let result = await fetch("http://localhost:3000/my_personal_collection/");
        if(result.status == 200){
            setData(result.result);
        }
        else{
            setError(result.message)
        }
    },[])
    return(
        <div>
            {
                err && data.length == 0 ? <p>{err}</p> : 
                <table>
                    <thead>
                        <tr>
                {
                    data.map(ele=>{
                        return(
                            <th key={ele.id}>
                                {ele.concept}
                            </th>
                        )
                    })
                }
                </tr>
                    </thead>

                    <tbody>
                    {
                    data.map(ele=>{
                        return(

                            <tr key={ele.id}>
                               <td> {ele.url}</td> 
                            </tr>
                        )
                    })
                }
                    </tbody>
                 </table>
            }
        </div>
    )
}