


import {useEffect , useState}  from "react";
const UseEffect = () => {
    const [count, setCount] = useState(" ");

    useEffect(() => {
        setTimeout(() => {
            setCount("Data fatched");
        }, 3000)
    }, [])

    return (
        <>    
        <div className="flex flex-col items-center p-4">
            <h1>data is comming after 3 second</h1>
            <h1>{count}</h1>
        </div>
        </>
    )
}
export default UseEffect;