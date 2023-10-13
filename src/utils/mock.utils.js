import {faker} from '@faker-js/faker'

//faker.seed_locale = ('es')

export const generateProduct = () =>{
    return{
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.number.int({min:200, max:100000}),
        status: faker.datatype.boolean(),
        stock: faker.number.int({min:10, max:100}),
        category: faker.commerce.productMaterial(),
        thumbnail: faker.image.url()
    }
}
