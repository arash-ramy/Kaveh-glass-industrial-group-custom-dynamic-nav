const mongoose = require("mongoose");

const telegramChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  tags: {
    type: [],
  },
  userCreater:{
    type:mongoose.Shcema.Types.ObjectId,
    ref:"user"
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
  reported:{
    type:
  }

  
});

module.exports = mongoose.model("telegramChannel", telegramChannelSchema);
