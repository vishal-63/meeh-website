const { Router } = require("express");
const router = Router();

const fs = require("fs");
const Product = require("../models/product");
const ImageKit = require("imagekit");

// const uploadToImageKit = async (
//   bigImgBuffer,
//   bigFileName,
//   productName
// ) => {
//   const imageKit = new ImageKit({
//     publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
//     privateKey: process.env.IMAGE_KIT_SECRET_KEY,
//     urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
//   });

//   try {
//     let product;

//     imageKit.upload(
//       {
//         file: bigImgBuffer,
//         fileName: bigFileName,
//       },
//       async (err, result) => {
//         if (err) {
//           throw new Error(err);
//         } else {
//           product = new Product({
//             product_name: productName,
//             description: "Hoodie",
//             size: [],
//             color: [],
//             price: 1100,
//             category: "Clothing",
//             sub_category: "Hoodie",
//             discount: 0,
//             reviews: [],
//             is_deleted: false,
//             inventory: [
//               {
//                 stock: 0,
//                 color_id: "",
//                 thumbnail_images: [result.url],
//                 large_images: [result.url],
//               },
//             ],
//           });

//         //   imageKit.upload(
//         //     {
//         //       file: bigImgBuffer,
//         //       fileName: bigFileName,
//         //     },
//         //     async (err, result) => {
//         //       if (err) {
//         //         throw new Error(err);
//         //       } else {
//         //         product.inventory[0].large_images.push(result.url);

//         //         console.log(product);
//         //         await product.save((err, product) => {
//         //           if (err) {
//         //             console.log(err);
//         //             throw new Error("Cloud not save product");
//         //           } else {
//         //             console.log("done");
//         //           }
//         //         });
//         //       }
//         //     }
//         //   );
//             console.log("done");
//         }
//       }
//     );
//   } catch (err) {
//     console.log(err, err.message);
//   }
// };

const uploadToImageKit1 = async (largeImgBuffer, fileName) => {
  const imageKit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_SECRET_KEY,
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  });

  try {
    const result = await imageKit.upload({
      file: largeImgBuffer,
      fileName: fileName,
    });
    return result;
  } catch (error) {
    console.log(error.message, error);
  }
};

router.get("/deleteProducts", async (req, res) => {
  await Product.deleteMany({
    product_name: { $regex: "bookmark test1", $options: "i" },
  });
  res.send("done");
});

// upload n Hoodies
router.get("/setImages",async (req,res)=>{

  const folderName = "assets/Hoodies";

//   const dirResult = await fs.promises.readdir(folderName);

//   dirResult.map(async (folder)=>{
//     const product = new Product({
//       product_name: folder,
//       description: `Hoodies`,
//       size: [],
//       color: [],
//       price: 1100,
//       category: "Hoodies",
//       sub_category: "Hoodies",
//       discount: 0,
//       reviews: [],
//       is_deleted: false,
//       inventory: [
//         {
//           stock: 0,
//           color_id: "",
//           thumbnail_images: [],
//           large_images: [],
//         },
//       ],
//     });
    const images = await fs.promises.readdir(folderName);
    console.log(images);
    // res.send(images);
    // return;
    const test=[];

    for(let i=0;i<images.length;i++){
      const imageBuffer = await fs.promises.readFile(folderName+"/"+images[i]);
      const imageResult = await uploadToImageKit1(imageBuffer,"Hoodies");
    //   continue;
      const individualProduct = new Product({
        product_name: "Hoodie "+i,
        description: `Hoodies | Clothing`,
        size: [],
        color: [],
        price: 1100,
        category: "Hoodies",
        sub_category: "Hoodies",
        discount: 0,
        reviews: [],
        is_deleted: false,
        inventory: [
          {
            stock: 0,
            color_id: "",
            thumbnail_images: [imageResult.url],
            large_images: [imageResult.url],
          },
        ],
      });

    //   product.inventory[0].large_images.push(imageResult.url);

    //   individualProduct.inventory[0].large_images.push(imageResult.url);

      await individualProduct.save();
      test.push(individualProduct.id);

      console.log(individualProduct.product_name,
        individualProduct.inventory[0].thumbnail_images,
        individualProduct.inventory[0].large_images);

    }
    // await product.save();
    res.send(test);
    console.log(test);
    // console.log(product.product_name,product.inventory[0].large_images);

});

  // const testImage = await fs.promises.readFile(testFolderName+"/"+testDirResult[0]);

//   res.send("Done");

// router.get("/setImages1", async (req, res) => {
//   const foldername = "assets/big/Bookmark/new/SHERLOCK";
//   const bigDir = await fs.promises.readdir(foldername);

//   console.log(bigDir[0].split(".")[0]);

//     const product = new Product({
//       product_name: "SHERLOCK BOOKSMARKS SET OF 5",
//       description: `SHERLOCK BOOKSMARKS SET OF 5 (Bookmarks) - Ultra HD Prints1 - Gloss Laminated Finish - Tear Proof - Ideal Size - Handy Feel - Dimensions: 7” * 2” (inch) - Weight: 4gm`,
//       size: [],
//       color: [],
//       price: 30,
//       category: "Bookmarks",
//       sub_category: "pending",
//       discount: 0,
//       reviews: [],
//       is_deleted: false,
//       inventory: [
//         {
//           stock: 0,
//           color_id: "",
//           thumbnail_images: [],
//           large_images: [],
//         },
//       ],
//     });

//     for(let i=0;i<bigDir.length;i++){

//       const bigImgBuffer = await fs.promises.readFile(
//         foldername + "/" + bigDir[i]
//       );

//       const imageResult = await uploadToImageKit1(
//         bigImgBuffer,
//         bigDir[i].split(".")[0]
//       );

//       product.inventory[0].large_images.push(imageResult.url);
//     }

//   await product.save();
//   console.log(product.product_name,product.inventory[0].large_images[0]);

//   res.send("hello");
//   // console.log("=============================================")
//   // // res.send(folders);
//   // res.end("0");
// });

router.get("/changeDetails",async (req,res)=>{

  // const products = await Product.find({category:{$regex:"mousepad", $options:"i"}});

  // let regEx = new RegExp("booksmark", "ig");

  // products.map( async (product)=>{
  //   product.category ="Mousepad";
  //   await product.save();
  // });

  res.send("Done");
});

// router.get("/delete/:id", async (req, res) => {
//   console.log(req.params);

//   await Product.deleteOne({ _id: req.params.id });

//   res.redirect("/editProducts/");
// });

router.get("/:id", async (req, res) => {
  if (
    (req.params.id != null || req.params.id != undefined) &&
    req.params.id >= 0
  ) {
    const product = await Product.findOne().skip(req.params.id);
    res.render("editProducts", {
      product: product,
      next: parseInt(req.params.id),
    });
  } else {
    // console.log(product);
    res.redirect("/editProducts/0");
  }
});

router.get("/changeDescription",async (req,res)=>{
  const products = await Product.find({
    category:{$regex: "bookmark", $options: "i"}
  });

  for(let i=0;i<products.length;i++){
    products[i].description = `${products[i].product_name}|Ultra HD Prints1|Gloss Laminated Finish|Tear Proof|Ideal Size|Handy Feel|Dimensions: 7” * 2” (inch)|Weight: 4gm`;
    await products[i].save();
    console.log(`${i+1} out of ${products.length}`);
  }
  res.send("Done.");
})

router.get("/changeDetails/:id",async (req,res)=>{

  const product = await Product.findById(req.params.id);
  console.log(product);

  res.render("editProducts",{product:product,next:0});
});

router.get("/delete/:id", async (req, res) => {
  console.log(req.params);

  await Product.deleteOne({ _id: req.params.id });

  res.redirect("/editProducts/");
});

module.exports = router;
