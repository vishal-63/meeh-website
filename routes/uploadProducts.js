const { Router } = require("express");
const router = Router();

const fs = require("fs");
const Product = require("../models/product");
const ImageKit = require("imagekit");

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

//upload set of n bookmarks
// router.get("/setImages",async (req,res)=>{

//   const folderName = "assets/big/Bookmark/10 SET";

//   const dirResult = await fs.promises.readdir(folderName);

//   dirResult.map(async (folder)=>{
//     const product = new Product({
//       product_name: folder,
//       description: `${folder} (Bookmarks) - Ultra HD Prints1 - Gloss Laminated Finish - Tear Proof - Ideal Size - Handy Feel - Dimensions: 7” * 2” (inch) - Weight: 4gm`,
//       size: [],
//       color: [],
//       price: 100,
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
//     const images = await fs.promises.readdir(folderName+"/"+folder);

//     for(let i=0;i<images.length;i++){
//       const imageBuffer = await fs.promises.readFile(folderName+"/"+folder+"/"+images[i]);
//       const imageResult = await uploadToImageKit1(imageBuffer,"Bookmark 1");

//       const individualProduct = new Product({
//         product_name: folder.split("SET OF 5")[0],
//         description: `${folder.split("SET OF 5")[0]} (Bookmarks) - Ultra HD Prints1 - Gloss Laminated Finish - Tear Proof - Ideal Size - Handy Feel - Dimensions: 7” * 2” (inch) - Weight: 4gm`,
//         size: [],
//         color: [],
//         price: 30,
//         category: "Bookmarks",
//         sub_category: "pending",
//         discount: 0,
//         reviews: [],
//         is_deleted: false,
//         inventory: [
//           {
//             stock: 0,
//             color_id: "",
//             thumbnail_images: [],
//             large_images: [],
//           },
//         ],
//       });

//       product.inventory[0].large_images.push(imageResult.url);

//       individualProduct.inventory[0].large_images.push(imageResult.url);

//       await individualProduct.save();

//       console.log(individualProduct.product_name,individualProduct.inventory[0].large_images);

//     }
//     await product.save();

//     console.log(product.product_name,product.inventory[0].large_images);

//   });

//   // const testImage = await fs.promises.readFile(testFolderName+"/"+testDirResult[0]);

//   res.send("Done");

// });

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

router.get("/changeDetails", async (req, res) => {
  const products = await Product.find({
    product_name: { $regex: "bookmarks", $options: "i" },
  });

  let regEx = new RegExp("bookmarks", "ig");

  products.map(async (product) => {
    product.product_name = product.product_name.replace(regEx, "BOOKSMARK");
    product.description = product.description.replace(regEx, "BOOKSMARK");
    await product.save();
  });

  res.send("Done");
});

router.get("/delete/:id", async (req, res) => {
  console.log(req.params);

  await Product.deleteOne({ _id: req.params.id });

  res.redirect("/editProducts/");
});

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

router.get("/", async (req, res) => {
  res.redirect("/editProducts/0");
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const {
    _id,
    product_name,
    price,
    description,
    category,
    sub_category,
    next,
    small_image,
  } = req.body;
  // res.send(req.body);
  const product = await Product.findById(_id);
  product.product_name = product_name;
  product.price = price;
  product.description = description;
  product.category = category;
  product.sub_category = sub_category;
  product.inventory[0].thumbnail_images[0] = small_image;

  try {
    await product.save();
  } catch (err) {
    console.log(err);
  }

  res.redirect(`/editProducts/${next}`);
});

module.exports = router;
