const express = require("express");
const Sidebar = require("../model/sidebar");
const mongoose = require("mongoose");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");

// login user
router.post(
  "/create-sidebar",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log(req.body);

      const { caption, floor, row, parentId } = req.body;
      if (!caption || !floor || !row) {
        return next(new ErrorHandler("please fill all inputs", 400));
      }

      // const rowDuplicated = await Sidebar.find({ row: row, floor: floor });
      // console.log(rowDuplicated.length, "qqqq");

      // // if ( rowDuplicated.length !== 0) {
      // console.log("na injas");

      // const gratherThenInputRow = await Sidebar.find({})

      //   .where("row")
      //   .gt(row)
      //   .where("floor")
      //   .equals(floor)
      //   .sort({ row: 1 });
      // console.log(gratherThenInputRow);

      // console.log(gratherThenInputRow.length, "wwwww");
      // if (gratherThenInputRow.length !== 0) {
      //   gratherThenInputRow.forEach(async (element) => {
      //     console.log(element.row, "dsd");
      //     console.log(element.caption, "dsd");
      //     console.log(element.floor, "dsd");

      //     const filter = { floor: element.floor, row: element.row };

      //     const update = { row: element.row + 1 };

      //     await Sidebar.findOneAndUpdate(filter, update);
      //   });
      // }
      // seri 2

      // console.log(rowDuplicated, "hj");
      // if (rowDuplicated.length !== 0) {
      //   rowDuplicated[0].row = rowDuplicated[0].row + 1;
      //   await rowDuplicated[0].save();
      // }
      // const create = await Sidebar.create({
      //   caption: caption,
      //   floor: floor,
      //   row: row,
      //   parentId: parentId,
      // });
      const updateMany = await Sidebar.updateMany(
        { floor: floor, row: { $gte: row } },
        [{ $set: { row: { $sum: ["$row", 1] } } }]
      );
      const create = await Sidebar.create({
        caption: caption,
        floor: floor,
        row: row,
        parentId: parentId,
      });

      console.log("injas");

      return res.status(200).json({
        updateMany,
        create,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.delete(
  "/delete-sidebar",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log(req.body);

      const { floor, row } = req.body;
      if (!floor || !row) {
        return next(new ErrorHandler("please fill all inputs", 400));
      }

      // const rowDuplicated = await Sidebar.find({ row: row, floor: floor });
      // console.log(rowDuplicated.length, "qqqq");

      // // if ( rowDuplicated.length !== 0) {
      // console.log("na injas");

      // const gratherThenInputRow = await Sidebar.find({})

      //   .where("row")
      //   .gt(row)
      //   .where("floor")
      //   .equals(floor)
      //   .sort({ row: 1 });
      // console.log(gratherThenInputRow);

      // console.log(gratherThenInputRow.length, "wwwww");
      // if (gratherThenInputRow.length !== 0) {
      //   gratherThenInputRow.forEach(async (element) => {
      //     console.log(element.row, "dsd");
      //     console.log(element.caption, "dsd");
      //     console.log(element.floor, "dsd");

      //     const filter = { floor: element.floor, row: element.row }; // {$gt: {row, element.row}} };

      //     const update = { row: element.row - 1 };

      //     console.log(rowDuplicated, "hj");
      //     if (rowDuplicated.length !== 0) {
      //       //   rowDuplicated[0].row=  rowDuplicated[0].row-1
      //       //  await rowDuplicated[0].save()
      //       const create = await Sidebar.findOneAndDelete({
      //         floor: floor,
      //         row: row,
      //       });
      //     }

      //     await Sidebar.findOneAndUpdate(filter, update);

      //   });
      // }
      //     const updateMany2 = await Sidebar.find( {  floor: floor, row: { $gt: row } })

      const updateMany2 = await Sidebar.deleteOne({ floor: floor, row: row });

      // console.log(updateMany2)
      const updateMany = await Sidebar.updateMany(
        { floor: floor, row: { $gt: row } },
        [{ $set: { row: { $subtract: ["$row", 1] } } }]
      );

      // input: "$row",
      // as: "grade",
      // in: { $set: [ "$grade.row",55 ] }

      // )

      // const updateMany = await Sidebar.find( {  floor: floor, row: { $gt: row } })

      // console.log(updateMany)

      // const updateMany2 = await Sidebar.updateMany(
      // {  floor: floor, row: { $gt: row } },
      //   {

      //   }
      // );
      // console.log("injas");

      // const filter = { floor: element.floor, row: $gr(row), }; // {$gt: {row, element.row}} };
      // const update = { row: element.caption - 1 };

      // await Sidebar.deleteMany(filter,{})

      return res.status(200).json({
        // updateMany,
        updateMany,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// router.delete(
//   "/delete-sidebar",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       console.log(req.body);

//       const { floor, row } = req.body;
//       if (!floor || !row) {
//         return next(new ErrorHandler("please fill all inputs", 400));
//       }

//       const rowDuplicated = await Sidebar.find({ row: row, floor: floor });
//       console.log(rowDuplicated.length, "qqqq");

//       // if ( rowDuplicated.length !== 0) {
//       console.log("na injas");

//       const gratherThenInputRow = await Sidebar.find({})

//         .where("row")
//         .gt(row)
//         .where("floor")
//         .equals(floor)
//         .sort({ row: 1 });
//       console.log(gratherThenInputRow);

//       console.log(gratherThenInputRow.length, "wwwww");
//       if (gratherThenInputRow.length !== 0) {
//         gratherThenInputRow.forEach(async (element) => {
//           console.log(element.row, "dsd");
//           console.log(element.caption, "dsd");
//           console.log(element.floor, "dsd");

//           const filter = { floor: element.floor, row: element.row };

//           const update = { row: element.row - 1 };

//           await Sidebar.findOneAndUpdate(filter, update);
//         });
//       }
//       console.log(rowDuplicated, "hj");
//       if (rowDuplicated.length !== 0) {
//         //   rowDuplicated[0].row=  rowDuplicated[0].row-1
//         //  await rowDuplicated[0].save()
//         const create = await Sidebar.findOneAndDelete({
//           floor: floor,
//           row: row,
//         });
//       }

//       // }

//       console.log("injas");

//       //   const filter =
//       //     {"floor":floor ,"row" : row}

//       //   const update = { "caption": "arash2" };

//       //   const update2= await Sidebar.findOneAndUpdate(filter,update)
//       //
//       return res.status(200).json({
//         // create,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

router.patch(
  "/update-sidebar",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { row, floor, newCaption, newRow, parentId } = req.body;
      console.log(req.body, "req.body");
      if (!row || !floor) {
        return res.status(400).json({
          message: "please inter inputs",
        });
      }

      //  UPDATE CAPTION
      // if (
      //   newCaption &&
      //   newCaption !== "" &&
      //   newCaption !== undefined &&
      //   newCaption !== null
      // ) {
      //   const updateCaption = await Sidebar.updateMany(
      //     { floor: floor, row: row },
      //     { $set: { caption: newCaption } }
      //   );
      // }


        // SWITCH ROWS
      const updateMany = await Sidebar.updateMany(
        { floor: floor, row: row },
        { $set: { row: newRow } }
      )
        .then(async () => {
          const data = await Sidebar.updateOne(
            { floor: floor, row: newRow },
            { $set: { row: row } }
          );
        return data    
        }).then(async(res)=>{
          console.log(res,"in res")
          // console.log(data,"in datas")

        })
        .catch((error) => console.log(error));

      // const updateMany = await Sidebar.updateMany(
      //   { floor: floor, $and:[{row: { $gt: newRow }}]},
      //   [{ $set: { row: { $sum: ["$row", 1]   } } }]
      // );

      //   const updateMany1 = await Sidebar.updateMany(
      //     { floor: floor, $and:[{row:{ $lt: newRow }} ,{row:{ $gt: row} } ] },
      //     [{ $set: { row: { $subtract: ["$row", 1]   } } }]
      //   );

      //if( newCaption ){
      //   update(caption) // find by last floor and row
      // }

      // if( newFloor ){
      //   update("all row > {row} => row - 1")
      // }

      return res.status(201).json({
        updateMany,
        message: "successfuly",
        // updateMany1,
        // updateFoundedRow
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.post(
  "/test",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const data = "اين يك پست است و نياز به  ديده شدن دارد";
      data.replace(" ", "-");
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
