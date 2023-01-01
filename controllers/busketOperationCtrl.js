const {Busket} = require('../Models/BusketOperation')
const {MeatType} = require('../Models/MeatType');

// Get All ------------------------
exports.getAll = async (req, res, next) => {
    try{
        const bus = await Busket.find()
        .select('_id userName item count salary totalSalary payment paid refund paidAfterRefund date')
        .populate('userName item', 'name name').sort('date')
        .then(result =>{
            res.status(200).json({
              count: result.length,
              Busket: result
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

// Get All Client Receipts ------------------------
exports.getClientAllReceipts = async (req, res, next) => {
    try{
        const bus = await Busket.find({userName: req.params.id})
        .select('_id userName item count salary totalSalary payment paid refund paidAfterRefund date')
        .populate('userName item', 'name name').sort('name')
        .then(result =>{
          res.status(200).json({
            count: result.length,
            Busket: result
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

// Get specific Receipts ------------------------
exports.getSpecific = async (req, res, next) => {
    try{
        const bus = await Busket.find({_id: req.params.id})
        .select('_id userName item count salary totalSalary payment paid refund paidAfterRefund date')
        .populate('userName item', 'name name').sort('name')
        .then(result =>{
          res.status(200).json({
            count: result.length,
            Busket: result
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

// Create New Object ------------------------
exports.addNew = async (req, res, next) => {
    try{
        // Call Finction for push driven data ....
        // function get item salary from MeatType Schema
        let sal = await postSalary(req.body)
        // function get item salary from MeatType Schema
        let totalSal = await TotalSalary(req.body)
        // function get item salary from MeatType Schema
        let pay = await Payement(req.body)

        // Define Object from bus Schema to push data on it 
        let bus = new Busket({ 
                userName: req.body.userName,
                item: req.body.item,
                salary: sal,
                totalSalary: totalSal,
                payment: pay,
                paid: req.body.paid,
                refund: req.body.refund,
                paidAfterRefund : req.body.paid - req.body.refund
            })
            .save()
            .then(result =>{
                res.status(200).json({
                    message: 'Object Created Successfully',
                    Busket: result
                });
                console.log(result)
            })
            .catch(err =>{ 
                console.log('error', err)
                res.status(500).json({
                    error: err.message
                })
            })

        // Function to edit data of items in MeatTypr Schema after post data on bus schema [count - total salary]
        editMeatSchema(req.body)
    }catch(error){
        next(error)
    } 
};

// Update Object ------------------------
exports.updateOne = async (req, res, next) => {
    try{
        // Call Finction for push driven data ....
        // function get item salary from MeatType Schema
        let sal = await postSalary(req.body)
        // function get item salary from MeatType Schema
        let totalSal = await TotalSalary(req.body)
        // function get item salary from MeatType Schema
        let pay = await Payement(req.body)

        const bus = await Busket.findByIdAndUpdate(req.params.id, {
            $set: {
            userName: req.body.userName,
            item: req.body.item,
            count: req.body.count,
            salary: sal,
            totalSalary: totalSal,
            payment: pay,
            paid: req.body.paid,
            refund: req.body.refund,
            paidAfterRefund : req.body.paid - req.body.refund
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

// Delete Object ------------------------
exports.deleteOne = async (req, res, next) => {
    try{
        await Busket.findByIdAndDelete(req.params.id)
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

// Counting price of each one payment ------------------------
async function postSalary(bus){

  // define object to push salary from MeatType on it
  let slryArray = bus.salary
  // defin object to get length and values from item[meatType.id , count]
  let itemIdArray = bus.item

  // mapping object to get ids from item.meatType
  const map2 = itemIdArray.map(obj => obj.meatType); //[5,10,....]

  // fetch data from MeatType schema which equal id from map2
  let docs= await MeatType.find(
    {
      _id : { 
        $in: map2
      } 
    })

  // mapping object to get salaryAfterSale from MeatType by using docs
  const map1 = docs.map(obj => obj.salaryAfterSale); //[5,10,....]
  slryArray = map1

  //console.log('slary is' , slryArray) 
  return slryArray

}

// Counting TotalPrice for each one alone ------------------------
async function TotalSalary(bus){
  
  let itemIdArray = bus.item
  let totalArray = []

  // Fetch MeatType Ids from bus schema
  const map2 = itemIdArray.map(obj => obj.meatType); //[5,10,....]
  //console.log('itemarray is ',map2) //[id1, id2 ,....] 
  
  // Fetch MeatType Count from bus schema
  const countMap = itemIdArray.map(obj => obj.count); //[5,10,....]
  //console.log('countMap is ',countMap) //[id1, id2 ,....] 

  // Fetch Objects had ids in bus schema from MeatType Schema
  let docs = await MeatType.find(
    {
      _id : { 
        $in: map2
      } 
    }) //fetch all from db depend on array
  //console.log('docs is ',docs)
  
  // Fetch MeatType SalayAfterArray from MeatType schema
  const map1 = docs.map(obj => obj.salaryAfterSale); //[5,10,....]

  // SalaryAfterArray * count
  for(s = 0 , c = 0 ; s < map1.length , c < countMap.length ; s++ , c++){
      let x = map1[s] * countMap[c]
      totalArray.push(x)
  }
  //console.log('total price of each element is ',totalArray)

  // push totalSalary in /req.body.totalSalary/
  bus.totalSalary = totalArray
  return(bus.totalSalary)
}

// Counting TotalPrice payment ------------------------
async function Payement(bus){

  // fetch total salay and push it in array
  let totalSalaryArray = await TotalSalary(bus)
  let sum = 0

  // array summation and collect total payment
  /*for(i = 0 ; i < totalSalaryArray.length ; i++ ){
    sum += totalSalaryArray[i]
  }*/
  totalSalaryArray.forEach((price) => sum += price)
  //console.log('total payment is ',sum)

  // push summation in /req.body.payment/
  bus.payment = sum
  return(bus.payment)

}

// Edit Count and totalSalary in MeatType ------------------------
async function editMeatSchema(bus){
  
  let salaryArray = bus.totalSalary
  let itemIdArray = bus.item
  let itemTotalSalary = bus.totalSalary

  // mapping object to get ids from item.meatType \ to find ids want to edit \
  const meatTypeId = itemIdArray.map(obj => obj.meatType); //[5,10,....]
  //console.log('meatTypeId is ....... ', meatTypeId)

  // fetch data from MeatType schema which equal id from map3 \ to fetch ids want to edit \
  let docs= await MeatType.find(
    {
      _id : { 
        $in: meatTypeId
      } 
    })
  //console.log('doc we want to edit count and total salry on them are ...', docs)

  // mapping to fetch total count from meatType Schema 
  const meatTypeCount = docs.map(obj => obj.count);
  //console.log('MeatType Count ....... ', meatTypeCount)

  // mapping object to fetch count we sold 
  const minesCount = itemIdArray.map(obj => obj.count); //[5,10,....]
  //console.log('minesCount is ....... ', minesCount)

  // mapping to fetch total TotalSalary from meatType Schema 
  const meatTypeTotalSalary = docs.map(obj => obj.TotalSalary);
  //console.log('meatTypeTotalSalary ....... ', meatTypeTotalSalary)

  // mapping object to get ids from item.meatType \ to find ids want to edit \
  const busTotalSalay = itemTotalSalary.map(obj => obj); //[5,10,....].totalSalary
  //console.log('busTotalSalay is ....... ', busTotalSalay)

  // Couniting new Count and new Total Salary of Items
  for(c = 0 ; c < minesCount.length ; c++){
    meatTypeCount[c] = meatTypeCount[c] - minesCount[c]
    meatTypeTotalSalary[c] = meatTypeTotalSalary[c] - busTotalSalay[c]
  }
  //console.log('new count to items is ', meatTypeCount)
  //console.log('new Total Salary to items is ', meatTypeTotalSalary)
  
  // edit and save new count and Total Salary in MeatType Schema
  for( i = 0 ; i < meatTypeId.length ;  i++){
    const meat = await MeatType.findById(meatTypeId[i])
    meat.count = meatTypeCount[i];
    meat.TotalSalary = meatTypeTotalSalary[i]
    meat.save()
  }
  
  return 0;
}