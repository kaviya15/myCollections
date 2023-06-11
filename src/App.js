import React ,{ useState,useEffect } from 'react';
// import PostData from './components/PostData';
// import GetData from './components/getData';
import './App.css';
function App() {
  const [currentPage , setCurrentPage] = useState(1);
  const  [A_data,setData] = useState([]);
  const [totalData,settotalData] = useState([]);
  const [availableTech , setAvailableTech] = useState([]);
  const [filterTech,setfilterTech] = useState("");
  const [err,setError] = useState("");
  const [url,setUrl]=useState("");
  const [tech,setTech] = useState("");
  
  useEffect(()=>{
    let splitted_href = window.location.href.split("/");
    splitted_href = splitted_href[splitted_href.length - 1];
    var currPage = splitted_href==='' ? 1 : parseInt(splitted_href)
    setCurrentPage(currPage);
    
    console.log(currentPage,"currentPage",splitted_href)
      
      let endpoint = window.location.href.split(window.location.origin)[1]
      var url  = endpoint === "/" ? "/search" : endpoint;
      setfilterTech()
      url = "/my_personal_collection" + url;
      fetch("https://my-collections-backend-v1.onrender.com" +url)
      .then(data=>data.json())
      .then(data=>{
        if(data){
          console.log("results",data["result"].result[0])
          setData(data["result"].result);
          let count = [];
          if(data["result"].total_count){
            count.push(1);
             let i = 11;
              while(i <= data["result"].total_count && i%10 !== 0){
                count.push((i+9)/10);
                i+=9;
              }
              console.log(count)
              settotalData(count)
          }
          
         
          console.log(A_data,err)
      }
      else{
          console.log("resul3t",A_data)
          setError(data.message)
      }
      }).catch(err=>{
        setError(err)
      });
     
       fetch("https://my-collections-backend-v1.onrender.com/my_personal_collection/fetchtech")
       .then(resp=>resp.json()).then(resp=>{
        if(resp.result.result){
            let obj = resp.result.result;
            let url  =window.location.href;
            for(let ob of obj){
              if(url.includes("tech") && 
              (ob.Tech === url.split("tech=")[1].split("&")[0])){
                ob.selected = true;
              }
              else{
                ob.selected = false;
              }
            }
            setAvailableTech(obj);
            console.log(obj)
            
        }
       }).catch(err=>{
         console.log(err)
       })

  },[filterTech]);
  const handleFilter = async function(event){
    
    window.location.href = window.location.origin + "/search?tech=" +event.target.value; 
    setfilterTech(event.target.value);
    console.log(filterTech,"filtertecj")
  }
  const getURL = function(){
    let href = window.location.href
    if(href.includes("tech") && !href.includes("page")){
      href = window.location.href + "&page=";
    }
    else if(href.includes("tech") && href.includes("page")){
        href = window.location.href.split("&page=")[0] + "&page=";
    }
    else if(!href.includes("tech")){
      href = window.location.href + "search?tech=all&page=";
    }

    return href;
  }

  const hanldeAdd = async function(){
    console.log(url,tech,"hello");
    let resp = await fetch("https://my-collections-backend-v1.onrender.com/my_personal_collection/post_content",{
      method:"POST",
      body:JSON.stringify({
        tech:tech,
        url:url
      }),
      headers:{
        "Content-Type":"application/json"
      }
    })
    resp = await resp.json();
    if(resp.message === "success"){
      setUrl("");
      setTech("");
      alert("successfully added")
    }
    else{
      alert("failed to add")
    }
    
  }
 
    return(
 
        <div className='data-tech'>
            <h1> <center> My Note Book 🥴 </center></h1> 

            <div className='container'> 

              <div className='side-options'>

                <div className='post_data'>
                   <h3 className='heading'> Add Data </h3>
                  <label> Tech :  <br/>
                    <input type="text" minLength = "3" value={tech} onChange={e=>setTech(e.target.value)} required></input>
                  </label> <br/>
                  <label> URL :  <br/>
                    <input type="text" minLength = "3" value={url} onChange={e=>setUrl(e.target.value)} required></input>
                  </label> <br/>
                  <button className="btn btn-primary" id="add" onClick={hanldeAdd}>Add</button>
                </div>

              </div>


            <div className='fetched_datas'>
            {
                err === "" && A_data.length === 0 ? <p>{err}</p> : 
                <table>
                    <thead>
                        <tr>
                          <th>Tech</th>
                          <th>URL</th>
                        </tr>
                    </thead>

                    <tbody>
                    {
                    A_data.map(ele=>{
                        return(

                            <tr key={ele.id}>
                              <td>{ele.concept}</td>
                               <td> <a href={ele.url}rel="noreferrer" target='_blank'> {ele.url} </a></td> 
                            </tr>
                        )
                    })
                }
                    </tbody>
                 </table>
            }

            </div>

            <div className='filter-by'> Filter
              <select onChange={handleFilter}>
              <option disabled> --Choose-- </option>
                <option value="all" key="all"> all </option>
                {
                  availableTech.length > 0 ?  
                  
                    availableTech.map(ele=>{
                      return(
                        <>

                        {
                          ele.selected ?<option value={ele.Tech} key={ele.Tech} selected>{ele.Tech} </option>  : <option value={ele.Tech} key={ele.Tech}>{ele.Tech} </option>
                        }
x
                        </>
                      )
                    })
                  
                  
                  : <option>No Data Added</option>
                }
              </select>
            </div>


            </div>

            <div>
            <nav aria-label="Page navigation example">
            <ul className="pagination">
              {
                  totalData.map(page=>{

                    return(
                      <li  className="page-item" key={page}>
                        
                        <a  id ={currentPage === page ? "active_page":"non-active_page"} className="page-link" 
                        href={getURL() + page}>{page}</a></li>
                    )
                  })
                  
              }

          
            </ul>
          </nav>


            </div>
            
        </div>


  );
}

export default App;
