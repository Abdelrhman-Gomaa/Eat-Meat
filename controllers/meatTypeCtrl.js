const {MeatType} = require('../Models/MeatType')

// Get All
exports.getAll = async (req, res, next) => {
    try{
        const meat = await MeatType.find()
        .select('_id name categId salary sale count salaryAfterSale TotalSalary')
        .populate('categId').sort('name')
        .then(result =>{
            res.status(200).json({
              count: result.length,
              MeatTypes: result
            });
        })
        .catch(err =>{
          res.status(500).json({
            error: err.message
          })
        })
    }catch(error){
        next(error)
    }
};

// Get details For Receipts
exports.getDetails =  async (req, res, next) => {
    try{
        const meat = await MeatType.find()
        .select('name salaryAfterSale')
        .then(result =>{
            res.status(200).json({
              count: result.length,
              MeatTypes: result
            });
            console.log(result)
        })
        .catch(err =>{
          res.status(500).json({
            error: err.message
          })
        })
    }catch(error){
        next(error)
    }
};

// Get Specific Item
exports.getSpecificItem = async (req, res, next) => {
    try{
        const meat = await MeatType.find({_id: req.params.id})
        .select('name salary sale salaryAfterSale')
        .then(result =>{
          res.status(200).json({
            count: result.length,
            MeatTypes: result
          });
          console.log(result)
        })
        .catch(err =>{
          res.status(500).json({
          error: err.message
          })
        })
    }catch(error){
        next(error)
    }
};

// Get Specific Category
exports.getSpecificCat = async (req, res, next) => {
    try{
        const meat = await MeatType.find({categId: req.params.id})
        .select('_id name categId salary sale count salaryAfterSale TotalSalary')
        .populate('categId').sort('name')
        .then(result =>{
          res.status(200).json({
            count: result.length,
            MeatTypes: result
          });
          console.log(result)
        })
        .catch(err =>{
          res.status(500).json({
          error: err.message
          })
        })
    }catch(error){
        next(error)
    }
};
  
// Create New Object
exports.addNew = async (req, res, next) => {
    try{
        let meat = await MeatType.findOne({
            name: req.body.name,
            categId: req.body.categId        
            });
        if(meat) return res.status(400).send("'" + req.body.name + "'" + ' is already exist')
    
        meat = new MeatType({ 
          name: req.body.name,
          picName: req.files[0].originalname,
          url: req.files[0].path,
          categId: req.body.categId,
          salary: req.body.salary,
          sale: req.body.sale,
          count: req.body.count,
          salaryAfterSale: salaryaftersale(req.body),
          TotalSalary: salaryaftersale(req.body) * req.body.count
        })
        .save()
        .then(result =>{
          res.status(200).json({
            message: 'Object Created Successfully',
            MeatTypes: result
          });
          console.log(result)
        })
        .catch(err =>{
          res.status(500).json({
          error: err.message
          })
        })
    }catch(error){
        next(error)
    } 
};

// Update Object
exports.updateOne = async (req, res, next) => {
    try{
        const meat = await MeatType.findByIdAndUpdate(req.params.id, {
            $set: {
              name: req.body.name,
              picName: req.files[0].originalname,
              url: req.files[0].path,
              categId: req.body.categId,
              salary: req.body.salary,
              sale: req.body.sale,
              count: req.body.count,
              salaryAfterSale: salaryaftersale(req.body),
              TotalSalary: salaryaftersale(req.body) * req.body.count
            }
          })
          .then(result =>{
            if(result){
              res.status(200).json({
                  message: 'Object Updated Successfully...'
              });
              console.log(result);
            }else{
              res.status(404).json({
                  message: 'Not Found Object...'
              });
            }
            console.log(result);
          })
          .catch(err=>{
            res.status(500).json({
              message: err.message
            })
          })
    }catch(error){
        next(error)
    }
};

// Delete Object
exports.deleteOne = async (req, res, next) => {
    try{
        await MeatType.findByIdAndDelete(req.params.id)
        .then(result =>{
          if(result){
              res.status(200).json({
                  message: 'Object Deleted...'
              });
          }else{
              res.status(404).json({
                  message: 'Not Found Object...'
              });
          }
          console.log(result);
        })
        .catch(err=>{
          res.status(500).json({
              message: err.message
          })
        });
    }catch(error){
        next(error)
    }
};

// Counting Salary
function salaryaftersale(user){
  let sale = user.sale
  if (sale = 0) {
    user = user.salary
  }else{
    user = user.salary - user.salary * user.sale / 100
  }
  return user;
}
