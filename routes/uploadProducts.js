const { Router } = require("express");
const router = Router();

const fs = require("fs");
const Product = require("../models/product");
const ImageKit = require("imageKit");

const uploadToImageKit = async (
  thumbnailImgBuffer,
  thumbnailFileName,
  bigImgBuffer,
  bigFileName,
  productName
) => {
  const imageKit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_SECRET_KEY,
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  });

  try {
    let product;

    imageKit.upload(
      {
        file: thumbnailImgBuffer,
        fileName: thumbnailFileName,
      },
      async (err, result) => {
        if (err) {
          throw new Error(err);
        } else {
          product = new Product({
            product_name: productName,
            description: "pending",
            size: [],
            color: [],
            price: 0,
            category: "pending",
            sub_category: "pending",
            discount: 0,
            reviews: [],
            is_deleted: false,
            inventory: [
              {
                stock: 0,
                color_id: "",
                thumbnail_images: [result.url],
                large_images: [],
              },
            ],
          });

          imageKit.upload(
            {
              file: bigImgBuffer,
              fileName: bigFileName,
            },
            async (err, result) => {
              if (err) {
                throw new Error(err);
              } else {
                product.inventory[0].large_images.push(result.url);

                console.log(product);
                await product.save((err, product) => {
                  if (err) {
                    console.log(err);
                    throw new Error("Cloud not save product");
                  } else {
                    console.log("done");
                  }
                });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err, err.message);
  }
};


// router.get("/setImages", async (req, res) => {
//   const foldername = "assets/big/A5 DIARY";
//   const thumbnailFolder = "assets/small/A5 DIARY";
//   const bigDir = await fs.promises.readdir(foldername);
//   const thumbnailDir = await fs.promises.readdir(thumbnailFolder);

//   // dir.map(async (file)=>{

//   //     const image =await fs.promises.readFile(foldername+"/"+file);
//   //     console.log(image);
//   //     folders.push(file);

//   // })

//   const resume =0;
//   for (let i = resume ; i < 49 ; i++) {
//     const thumbnailImgBuffer = await fs.promises.readFile(
//       thumbnailFolder + "/" + thumbnailDir[i]
//     );
//     const bigImgBuffer = await fs.promises.readFile(
//       foldername + "/" + bigDir[i]
//     );

//     uploadToImageKit(
//       thumbnailImgBuffer,
//       "A5 DAIRY" + i,
//       bigImgBuffer,
//       "A5 DAIRY" + i,
//       "A5 DAIRY" + i
//     );
//   }
//   res.send("hello");
//   // console.log("=============================================")
//   // // res.send(folders);
//   // res.end("0");
// });

router.get("/:id",async (req,res)=>{
    if( (req.params.id != null || req.params.id != undefined) && req.params.id >= 0){
        const product = await Product.findOne().skip(req.params.id);
        console.log(req.params.id);
        res.render("editProducts",{ product:product , next: parseInt(req.params.id)  });
    }
    else{
        // console.log(product);
        res.redirect("/editProducts/0");
    }
});

router.get("/",async (req,res)=>{
  res.redirect("/editProducts/0");
})

router.post("/",async(req,res)=>{
    console.log(req.body);
    const { _id,product_name,price,description,category,sub_category,next} = req.body;
    // res.send(req.body);
    const product = await Product.findById(_id);
    product.product_name = product_name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.sub_category = sub_category;

    try{
        await product.save();
    }
    catch(err){
        console.log(err)
    }

    res.redirect(`/editProducts/${next}`);
})

module.exports = router;
