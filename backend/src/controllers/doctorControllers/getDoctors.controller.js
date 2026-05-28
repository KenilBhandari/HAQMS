import prisma from '../../prisma.js';

const getDoctors = async(req,res)=>{
 try{

   const {search,specialization}=req.query;

   const doctors =
   await prisma.doctor.findMany({
      where:{
         ...(search && {
            name:{
               contains:search,
               mode:"insensitive"
            }
         }),

         ...(specialization &&
            specialization!=="All" && {

            specialization:{
               equals:specialization,
               mode:"insensitive"
            }
         })
      }
   });

   res.status(200).json({
      success: true,
      doctors
   });

 }
 catch(error){
   console.error(error);
   res.status(500).json({
      error:"Database execution failure"
   });
 }
}

export { getDoctors };
