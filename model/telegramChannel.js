const mongoose = require("mongoose");

const telegramChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  tags: {
    type: [],
  },
  Rule:{
    type:String ,
    default: 'user'
  },
  userCreater:{
    type:mongoose.Shcema.Types.ObjectId,
    ref:"User"
  },
  promotedBycustomer:{
      type:[]
  },
  url: {
    type: Number,
  },
 
  category: {
    type: Number,
    
  },
  reports:{
    type:[]
  }

  
});

module.exports = mongoose.model("telegramChannel", telegramChannelSchema);
