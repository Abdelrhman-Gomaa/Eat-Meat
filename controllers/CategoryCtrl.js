const {Category} = require('../Models/Category');

// Get All Categories
exports.getAll = async (req, res, next) => {
    try{
        const categories = await Category.find().sort('name')
        .then(result =>{
            res.status(200).json({
            count: result.length,
            Category: result
            });
        })
        .catch(err =>{
            res.status(500).json({
            error: err.message
            })
        })
    } catch(error){
        next(error)
    }
}

// Get Specific Category
exports.getSpecific = async (req, res, next) => {
    try{
        await Category.find({_id: req.params.id})
            .then(result =>{
                res.status(200).json({
                count: result.length,
                Category: result
                });
            })
            .catch(err =>{
                res.status(500).json({
                error: err.message
                })
            })
    } catch(err){
        next(err)
    }
}
  
// Add Category
exports.addCategory = async (req, res, next) => {
    try{
        console.log('category post Function')
        let cat = await Category.findOne({ name: req.body.name });
        if(cat) return res.status(400).send("'" + req.body.name + "'" + ' is already exist')

        cat = new Category({ 
            name: req.body.name,
            picName: req.files[0].originalname,
            url: req.files[0].path
        })
        .save()
        .then(result =>{
            res.status(200).json({
                message: 'Object Created Successfully',
                Category: result
            });
        })
        .catch(err =>{
            res.status(500).json({
                error: err.message
            })
        })
    }catch(error){
        next(error.message)
    }
};

// Update Object
exports.updateCategory = async (req, res, next) => {
    try{
        const cat = await Category.findByIdAndUpdate(req.params.id, {
            $set: {
              name: req.body.name,
              picName: req.files[0].originalname,
              url: req.files[0].path
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
          })
          .catch(err=>{
            res.status(500).json({
              message: err.message
            })
          })
    }catch(error){
        next(error)
    }
  
}

// Delete Object
exports.deleteOne = async (req, res, next) =>{
    try{
        await Category.findByIdAndDelete(req.params.id)
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
        })
        .catch(err=>{
            res.status(500).json({
                message: err.message
            })
        });
    }catch(error){
        next(error)
    }
}