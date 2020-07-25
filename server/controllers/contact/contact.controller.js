// const fetch = require("node-fetch");

// exports.addContact = (rep, res) => {
//     // const data = req.body;

//     fetch(
//         "https://api.hubapi.com/contacts/v1/contact/?hapikey=919d0c52-1673-41da-80bc-0427c33e9184",
//         {
//             method: "post",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 properties: [
//                     { property: "email", value: "null" },
//                     { property: "firstname", value: "test" },
//                     { property: "lastname", value: "testerson" },
//                     { property: "website", value: "http://hubspot.com" },
//                     { property: "phone", value: "555-122" },
//                     { property: "address", value: "25 First Street" },
//                 ],
//             }),
//         }
//     )
//         .then((res) => res.json())
//         .then((data) => {
//             res.status(200).json({ message: "sucess", data });
//         })
//         .catch((err) => res.status(422).json({ err }));
// };
