import sanitize from "mongo-sanitize"
export const userRegister= async (req,res)=>{
 try {
    const data= req.body
    //sanitizing for no-sql injection
    const sanitizedData= sanitize(data)

    //validators to be included

    res.status(201).json({message:"user registered",data:sanitizedData})

 } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal Server Error!"})
 }
}