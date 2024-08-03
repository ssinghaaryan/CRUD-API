const petModel = require('../models/pet.model');

// The apiName tag is used as reference for the order (in package.json)
/**
 * @api {get} api/pets Get all Pets
 * @apiVersion 1.0.0
 * @apiName GetPets
 * @apiGroup Pets
 * 
 * @apiExample {curl} JSON Request:
 * curl https://paws-api-app.vercel.app/api/pets \
 *  -H 'Accept: application/json'
 * 
 * @apiHeader {String} Accept =application/json Sets what format the response body is returned in.
 *   
 * @apiSuccess (Success: 200 OK) {Number} _id Pet ID generated by MongoDB
 * @apiSuccess (Success: 200 OK) {String} petName Pet Name
 * @apiSuccess (Success: 200 OK) {String} petType Pet Type [Dog/Cat]
 * @apiSuccess (Success: 200 OK) {String} petUID Pet Unique ID
 * @apiSuccess (Success: 200 OK) {Number} age Pet Age
 * @apiSuccess (Success: 200 OK) {Boolean} vacinationStatus Pet's Vacination Status
 * @apiSuccess (Success: 200 OK) {Boolean} availabilityStatus Pet's Availability Status
 * 
 * @apiSuccessExample {json} Response:
 * {
 *  "_id": "667954dfd198571b7e23b859",
 *  "petName": "Bruno",
 *  "petType": "Dog",
 *  "petUID": "bruno@1",
 *  "age": 2,
 *  "vacinationStatus": true,
 *  "availabilityStatus": true,
 * },
 * {
 *  "_id": "66797cd2369afecea1bb1c62",
 *  "petName": "Beetle",
 *  "petType": "Dog",,
 *  "petUID": "beetle_1",
 *  "age": 3,
 *  "vacinationStatus": true,
 *  "availabilityStatus": false,
 * },
 * {...}
*/

// Getting all Pets.
const getPets = async (req, res) => {
    try {
       const pets =  await petModel.find({});
       res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//--------

/**
 * @api {get} api/pets/:uid Get Pet by UID
 * @apiVersion 1.0.0
 * @apiName GetPet
 * @apiGroup Pets
 * 
 * @apiExample {curl} JSON Request:
 * curl https://paws-api-app.vercel.app/api/pets/{uid} \
 *  -H 'Accept: application/json'
 * 
 * @apiParam (URL Parameter) {String} uid Pet UID
 * 
 * @apiHeader {String} Accept =application/json Sets what format the response body is returned in.   
 * 
 * @apiSuccess (Success: 200 OK) {Number} _id Pet ID generated by MongoDB
 * @apiSuccess (Success: 200 OK) {String} petName Pet Name
 * @apiSuccess (Success: 200 OK) {String} petType Pet Type [Dog/Cat]
 * @apiSuccess (Success: 200 OK) {String} petUID Pet Unique ID
 * @apiSuccess (Success: 200 OK) {Number} age Pet Age
 * @apiSuccess (Success: 200 OK) {Boolean} vacinationStatus Pet's Vacination Status
 * @apiSuccess (Success: 200 OK) {Boolean} availabilityStatus Pet's Availability Status
 * 
 * @apiSuccessExample {json} Response:
 * {
 *  "_id": "667954dfd198571b7e23b859",
 *  "petName": "Bruno",
 *  "petType": "Dog",
 *  "petUID": "bruno@1",
 *  "age": 2,
 *  "vacinationStatus": true,
 *  "availabilityStatus": true,
 * }
 * 
 * @apiError (Error: 404 Not Found) PetNotFound Pet with the provided UID not found
 * 
 * @apiErrorExample Response:
 * {
 *  "message": "No Pet found with the specified UID"
 * }
*/

// Getting individual Pet by ID
const getPetById = async (req, res) => {
    try {
        const { id } = req.params; // id variable needs to be same as the id parameter.
        const pet = await petModel.findById(id);
        // res.message("")
        res.status(200).json(pet);
    } catch (error) {
        res.status(404).json({message: "No Pet found with the specified ID."});
    }
};

// Getting individual Pet via "petName".
const getPetByName = async (req, res) => {
    try {
        const petName = req.params.name;
        // pet = petModel.findOne({name});
        // const pet = await petModel.find(e => e.petName == name);
        // const pet = await petModel.find().then((e) => e.petName == name);
        // const pet = await petModel.findOne({ petName: petName });

        const pet = await petModel.findOne({
            petName: new RegExp(`^${petName}$`, 'i') // 'i' flag for case insensitivity
          });

        if (pet) {
            res.status(200).json(pet); // Send the pet object as JSON
        } else {
            res.status(404).send('Pet not found');
        }
        
    } catch (error) {
        // const pet = await petModel.find().then((e) => e.petName == name);
        // console.log(req.params['name']);
        res.status(404).json({message: "No Pet found with the specified name."});
    }
};

// Getting individual Pet via "petUID".
const getPetByUID = async (req, res) => {
    try {
        const petUID = req.params.uid;
        // pet = petModel.findOne({name});
        // const pet = await petModel.find(e => e.petName == name);
        // const pet = await petModel.find().then((e) => e.petName == name);
        // const pet = await petModel.findOne({ petName: petName });

        const pet = await petModel.findOne({
            petUID: new RegExp(`^${petUID}$`, 'i') // 'i' flag for case insensitivity
          });

        if (pet) {
            res.status(200).json(pet); // Send the pet object as JSON
        } else {
            res.status(404).send('Pet not found');
        }
        
    } catch (error) {
        // const pet = await petModel.find().then((e) => e.petName == name);
        // console.log(req.params['name']);
        res.status(404).json({message: "No Pet found with the specified name."});
    }
};

//--------

/**
 * @api {post} api/pets Add Pet
 * @apiVersion 1.0.0
 * @apiName AddPet
 * @apiGroup Pets
 * 
 * @apiExample {curl} JSON Request:
 * curl -X POST \
 *  https://paws-api-app.vercel.app/api/pets \
 *  -H 'Content-Type: application/json' \
 *  -H 'Accept: application/json' \
 *  -d '{
 *    "petName": "Zeus",
 *    "petType": "Cat",
 *    "petUID": "zeus@1"
 *    "age": 5,
 *    "vacinationStatus": false,
 *    "availabilityStatus": true
 * }'
 * 
 * @apiHeader {String} Content-Type =application/json Sets the format of payload you are sending.
 * @apiHeader {String} Accept =application/json Sets what format the response body is returned in.
 *   
 * @apiBody {String} petName Pet Name 
 * @apiBody {String} petType Pet Type [Dog/Cat]
 * @apiBody {String} petUID Pet UID
 * @apiBody {Number} age Pet Age!
 * @apiBody {Boolean} vacinationStatus Pet's Vacination Status
 * @apiBody {Boolean} availabilityStatus Pet's Availability Status
 * 
 * @apiSuccess (Success: 201 Created) {String} petName Pet Name
 * @apiSuccess (Success: 201 Created) {String} petType Pet Type [Dog/Cat]
 * @apiSuccess (Success: 200 Created) {String} petUID Pet Unique ID
 * @apiSuccess (Success: 201 Created) {Number} age Pet Age
 * @apiSuccess (Success: 201 Created) {Boolean} vacinationStatus Pet's Vacination Status
 * @apiSuccess (Success: 201 Created) {Boolean} availabilityStatus Pet's Availability Status
 * @apiSuccess (Success: 201 Created) {Number} _id Pet ID
 * 
 * @apiSuccessExample {json} Response:
 * {
 *  "petName": "Zeus",
 *  "petType": "Cat",
 *  "petUID": "zeus@1", 
 *  "age": 5,
 *  "vacinationStatus": false,
 *  "availabilityStatus": true,
 *  "_id": "667abd8a03385491af4cde05",
 *  "__v": 0
 * }
*/

// Adding Pet
const addPet = async (req, res) => {
    try {
        const pet = await petModel.create(req.body);
        res.status(201).json(pet)
        // res.status(201).json({ status: "Pet Added", pet});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//----------

/**
 * @api {put} api/pets/:uid Update Pet by UID
 * @apiVersion 1.0.0
 * @apiName UpdatePet
 * @apiGroup Pets
 * 
 * @apiExample {curl} JSON Request:
 * curl -X PUT \
 *  https://paws-api-app.vercel.app/api/pets/{uid} \
 *  -H 'Content-Type: application/json' \
 *  -H 'Accept: application/json' \
 *  -d '{
 *    "petName": "Bruno",
 *    "petType": "Dog",
 *    "petUID": "bruno@1"
 *    "age": 3,
 *    "vacinationStatus": true,
 *    "availabilityStatus": false
 * }'
 *
 * @apiHeader {String} Content-Type =application/json Sets the format of payload you are sending.
 * @apiHeader {String} Accept =application/json Sets what format the response body is returned in.
 *  
 * @apiParam (URL Parameter) {String} uid Pet UID
 * 
 * @apiSuccess (Success: 200 OK) {Number} _id Pet ID generated by MongoDB
 * @apiSuccess (Success: 200 OK) {String} petName Pet Name
 * @apiSuccess (Success: 200 OK) {String} petType Pet Type [Dog/Cat]
 * @apiSuccess (Success: 200 OK) {String} petUID Pet Unique ID
 * @apiSuccess (Success: 200 OK) {Number} age Pet Age
 * @apiSuccess (Success: 200 OK) {Boolean} vacinationStatus Pet's Vacination Status
 * @apiSuccess (Success: 200 OK) {Boolean} availabilityStatus Pet's Availability Status
 * 
 * @apiSuccessExample {json} Response:
 * {
 *  "_id": "667abd8a03385491af4cde05", 
 *  "petName": "Bruno",
 *  "petType": "Dog",
 *  "petUID": "bruno@1"
 *  "age": 3,
 *  "vacinationStatus": true,
 *  "availabilityStatus": false,
 *  "__v": 0
 * } 
 * 
 * @apiError (Error: 404 Not Found) PetNotFound Pet with the provided UID not found
 * 
 * @apiErrorExample {json} Response:
 * {
 *  "message": "Pet not found"
 * }
*/

// Update Pet by ID
const updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        
        const pet = await petModel.findByIdAndUpdate(id, req.body);

        if(!pet) {
            return res.status(404).json({message: "Pet not found"});
        }

        const updatedPet = await petModel.findById(id);
        res.status(200).json({updatedPet});
        // res.status(200).json({status: "Pet details Updated", updatedPet});

    } catch (error) {
        res.status(404).json({message: "Pet not found"});
    }
};

// Update Pet by petName.
const updatePetByName = async (req, res) => {
    try {
        const petName = req.params.name;
        // pet = petModel.findOne({name});
        // const pet = await petModel.find(e => e.petName == name);
        // const pet = await petModel.find().then((e) => e.petName == name);
        // const pet = await petModel.findOne({ petName: petName });

        const pet = await petModel.findOneAndUpdate(
            { petName: new RegExp(`^${petName}$`, 'i') }, // 'i' flag for case insensitivity
            req.body,
            { new: true } // Return the updated document
        );

        if (pet) {
            res.status(200).json(pet); // Send the pet object as JSON
        } else {
            res.status(404).json({message: 'Pet not found'});
        }
        
    } catch (error) {
        // const pet = await petModel.find().then((e) => e.petName == name);
        // console.log(req.params['name']);
        res.status(404).json({message: "No Pet found with the specified name."});
    }
};

// Update Pet by petUID.
const updatePetByUID = async (req, res) => {
    try {
        const petUID = req.params.uid;
        // pet = petModel.findOne({name});
        // const pet = await petModel.find(e => e.petName == name);
        // const pet = await petModel.find().then((e) => e.petName == name);
        // const pet = await petModel.findOne({ petName: petName });

        const pet = await petModel.findOneAndUpdate(
            { petUID: new RegExp(`^${petUID}$`, 'i') }, // 'i' flag for case insensitivity
            req.body,
            { new: true } // Return the updated document
        );

        if (pet) {
            res.status(200).json(pet); // Send the pet object as JSON
        } else {
            res.status(404).json({message: 'Pet not found'});
        }
        
    } catch (error) {
        // const pet = await petModel.find().then((e) => e.petName == name);
        // console.log(req.params['name']);
        res.status(404).json({message: "No Pet found with the specified name."});
    }
};

//-----------

/**
 * @api {delete} api/pets/:uid Delete Pet by UID
 * @apiVersion 1.0.0
 * @apiName DeletePet
 * @apiGroup Pets
 * 
 * @apiExample {curl} JSON Request:
 * curl -X DELETE \
 *  https://paws-api-app.vercel.app/api/pets/{uid} \
 *  -H 'Accept: application/json' 
 * 
 * @apiParam (URL Parameter) {String} uid Pet UID
 * 
 * @apiHeader {String} Accept =application/json Sets what format the response body is returned in.
 * 
 * @apiSuccess (Success: 200 OK) {String} message Pet Deleted Successfully
 * 
 * @apiSuccessExample {json} Response:
 * {
 *  "message": "Pet Deleted Successfully"
 * }
*/

// Delete Pet by ID
const deletePet = async (req, res) => {
    try {
        const { id } = req.params;

        const pet = await petModel.findByIdAndDelete(id);

        if(!pet) {
            return res.status(404).json({message: "Pet not found"});
        }

        res.status(200).json({message: "Pet Deleted Successfully"});

    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

// Delete Pet by petName.
const deletePetByName = async (req, res) => {
    try {
        const petName = req.params.name;
        // pet = petModel.findOne({name});
        // const pet = await petModel.find(e => e.petName == name);
        // const pet = await petModel.find().then((e) => e.petName == name);
        // const pet = await petModel.findOne({ petName: petName });

        const pet = await petModel.findOneAndDelete({
             petName: new RegExp(`^${petName}$`, 'i') // 'i' flag for case insensitivity
        });

        if (pet) {
            res.status(200).json({message: "Pet Deleted Successfully!"});
        } else {
            res.status(404).json({message: 'Pet not found'});
        }
        
    } catch (error) {
        // const pet = await petModel.find().then((e) => e.petName == name);
        // console.log(req.params['name']);
        res.status(404).json({message: "No Pet found with the specified name."});
    }
};

// Delete Pet by petUID.
const deletePetByUID = async (req, res) => {
    try {
        const petUID = req.params.uid;
        // pet = petModel.findOne({name});
        // const pet = await petModel.find(e => e.petName == name);
        // const pet = await petModel.find().then((e) => e.petName == name);
        // const pet = await petModel.findOne({ petName: petName });

        const pet = await petModel.findOneAndDelete({
             petUID: new RegExp(`^${petUID}$`, 'i') // 'i' flag for case insensitivity
        });

        if (pet) {
            res.status(200).json({message: "Pet Deleted Successfully!"});
        } else {
            res.status(404).json({message: 'Pet not found'});
        }
        
    } catch (error) {
        // const pet = await petModel.find().then((e) => e.petName == name);
        // console.log(req.params['name']);
        res.status(404).json({message: "No Pet found with the specified name."});
    }
};

module.exports = {
    getPets,
    // getPetById,
    // getPetByName,
    getPetByUID,
    addPet,
    // updatePet,
    // updatePetByName,
    updatePetByUID,
    // deletePet,
    // deletePetByName,
    deletePetByUID,
}