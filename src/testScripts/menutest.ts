import Dish from "../models/menu.entity";
import {getRepository, Repository} from 'typeorm'

const dishes: Dish[] = [
    {
        name: "ПЛАТО УСТРИЦ",
        price: 50,
        weight: "1000 гр",
        calories: "1000 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/b64f8031-90c1-4ad9-a9a5-470ad4f1d2d6#media-blob-url=true&id=4adee541-05f9-45a2-b69d-d2478116dd1d&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fpng&name=TM3vUYf2l5GfdF2cKJJ-ypShdJu3jwn9wMFPcBo2sJfZCspJ7I9YU07zHwkEebL4cTrbkW6Hlf7bGHkns3Pf-dPFGO-YH3eoxHaHBb5-kADeSoy9FD4CdkMQ0WlWt45VwbRdWP0%3Ds0&size=1368186&width=778&height=1384&alt=",
        ingredients: "Устрицы Фин де Клер;Устрицы Фин де Клер Зеленые;Лимон, соус миньонетт;Хлеб (белый черный), сливочное масло",
        dishCategory: "Плато"
    },
    {
        name: "ПЛАТО КРАБЫ И МОЛЮСКИ",
        price: 60,
        weight: "1500 гр",
        calories: "1000 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/c1a85865-1649-4060-8b96-0bf37de1e148#media-blob-url=true&id=0495b1d7-1ad9-4afd-bd1d-a2660547451b&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=Yt0cWs5SLWCMe_178U6hlpG0JmjaInbZVWLtAzlPT2yjpNNWlHfj3FSFKx-cCe2TXDKPUCffy8anNfs9KXDQ_sI8a3kvG7DkaUMmYxyJwjqw0rZCygA0199zT66F3gUNCqxuk4c%3Ds0&size=126176&width=750&height=938&alt=",
        ingredients: "краб опилио (фаланги);тигровые креветки;королевские креветки;песчаные креветки;моллюски: морские черенки, вонголе, мидии;соликорния;устрицы Фин де Клер;соусы: майонез вассаби*, айоли*, коктейльный *,топленое масло с чесноком, миньонетт;хлеб;сливочное масло ;лимон",
        dishCategory: "Плато"
    },
    {
        name: "ГОРЯЧЕЕ ПЛАТО",
        price: 70,
        weight: "1000 гр",
        calories: "900 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/69a2b7b5-cd08-48ea-b074-bc336254d3c4#media-blob-url=true&id=cdfdcab2-ffdc-4792-af2f-17d4f3291c85&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=C_QF38PYwa19SGfrP1BfwAgDhOATWNLtnDq96lN5MAHd7uKevnpq8GacJncbWEN1Kl9ghkXK8DvDqhylTQ2YO0SOI8rAsOCkAu_jty7jNhRfZlCKQXI0vyM1zRnVbw%3Ds0&size=203896&width=882&height=1080&alt=",
        ingredients: "морской гребешок с трюфельным маслом;осьминог с глазировкой из черного перца;королевские креветки в панцире с топленым маслом и чесноком;филе тунца с трюфельным понзу;филе сибаса с маслом с лемонграссом и имбирем;голубые мидии в соусе чоппино",
        dishCategory: "Плато"
    },
    {
        name: "БУЙАБЕС",
        price: 20,
        weight: "600 гр",
        calories: "300 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/db1444f8-46c5-4f74-8dcb-f284e99c6d2a#media-blob-url=true&id=f90ae2c3-320c-4344-a0bd-831b296fbfcb&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=Erd5lac15pcLuMZIoPWeO62-da9EXqNk-toryrADdOLTEer2Zx4a-kfVGWmyusvSfzA3-W3W7nAnDFR-6aoTBBxryQYVsYRh6P4aFhN4WBprDD1NdLeLev_FiI8mww%3Ds0&size=166330&width=936&height=1080&alt=",
        ingredients: "томаты;тигровые креветки;филе мерланга;морской  гребешок;голубые мидии",
        dishCategory: "Супы"
    },
    {
        name: "СУП БИСК БУЛЬОНЕ ИЗ ЛОБСТЕРА",
        price: 30,
        weight: "500 гр",
        calories: "250 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/a8a60e66-c04d-4312-aae1-d1486d258cd3#media-blob-url=true&id=a87134f2-f75f-4a2d-8073-bd19bdb0918f&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=ERCasMNJlRycwHj5XHi3RFF3y_SR825RS4tUv7cxo1qDZHjpl7RhGufpr15Eq5H6SYqv2d7lH56J_n6nOR62scJDVd4cEoP8waJKH5tqz9WyCev_ZnZnOKa0VytZFg%3Ds0&size=56879&width=510&height=510&alt=",
        ingredients: "лобстер;клешня европейского краба;песчаная креветка;морские гребешки;королевские креветки",
        dishCategory: "Супы"
    },
    {
        name: "ТАЙСКИЙ САЛАТ С ТИГРОВЫМИ КРЕВЕТКАМИ И БЕЙБИ-КАЛЬМАРАМИ",
        price: 35,
        weight: "450 гр",
        calories: "400 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/5ccd8ae5-2273-4f13-ae36-e079565015a0#media-blob-url=true&id=e00a0f9c-65d8-4ea6-a99b-7348bb29269e&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=qzMGPT0i8rX1nCa1XepZCoPx5CIcnZ9jvDhD38os6tUAD4YqsH_W6gWLN-lYIz4BicTiG1fQkM8Q9U_MLKc5MRJDwfvcZzXw1DE0ZJVDSmJ1UmGP38ETzA16tuDw3Q%3Ds0&size=137047&width=862&height=1080&alt=",
        ingredients: "Королевские креветки;Бейби-кальмары;Китайский салат;Бок Чой;Шпинат;Огурец;Кинза;Перец чили;Мята",
        dishCategory: "Салаты"
    },
    {
        name: "САЛАТ С КОПЧЕНЫМ ЛОСОСЕМ, ПЕРЕПИЛИНЫМ ЯЙЦОМ И МАРИНОВАННЫМ ЛУКОМ",
        price: 25,
        weight: "500 гр",
        calories: "300 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/c9e64ca3-69d4-4fc2-9edb-6ea4d5c12ab1#media-blob-url=true&id=4b8acc42-4e42-4011-ae22-572fcd8ed988&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=czsVQb1z8Tg-THK_OXsPii7Fdz7BySWgcyc7k8vvMoRZfpaJSiHbNP8fJL_ankYlfpM7AHWSyATX3lyrh5XOicvPc_pbsXixdmhws6P-IzTMbpB_XEJjhA0CFseyiQ%3Ds0&size=127575&width=914&height=1080&alt=",
        ingredients: "лосось копченый;лоло биондо;фрезе;шпинат;укроп;каперсы;шнитт лук;маринованный лук;перепелиные яйца;азиатский соус",
        dishCategory: "Салаты"
    },
    {
        name: "САЛАТ С МОРСКИМ ГРЕБЕШКОМ, ОСЬМИНОГОМ,БЕЙБИ-КАЛЬМАРОМ И КУНЖУТНЫМ МАСЛОМ",
        price: 40,
        weight: "450 гр",
        calories: "350 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/8ba01f36-3b25-40f4-add6-9feeb39531cb#media-blob-url=true&id=ce00f7a5-be79-4136-8253-e15688dc19db&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=MFfc991tWbeIijelfA2IHZG0yhssUkauTnB_yCCTfOUcHsaryxsFc8F5DEkB5dNM3K5E2hiUhPBID7PqqXiL0yx1GdSUWUBHWi8ldzY_25B5Y0GrtJ0ryejgqWE6mA%3Ds0&size=90168&width=492&height=762&alt=",
        ingredients: "обжареный гребешок;кальмары;щупальца осьминога;бок-чой;грибы муэр;соевые ростки;томаты черри;перец чили;кунжут;заправка мацухиса",
        dishCategory: "Салаты"
    },
    {
        name: "ЗАПЕЧЕНАЯ УСТРИЦА КИЛПАТРИК",
        price: 50,
        weight: "300 гр",
        calories: "270 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/e5e07660-428f-4bff-bc4b-ce2ae8c613a6#media-blob-url=true&id=c7f20b34-08f8-45ea-8059-be337095b5df&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=kvdEPxfRc5NSh9OzSZcEOX7gizNGDW-26Kg0ngJt9nwn9Y5EGzOlW7HsZpY7iW1MYF2krEvmBr2ST8la1kJ046bFm4Qe4YI6MgKJ13U7fuNGhoLGrGIADY4oEGIyxQ%3Ds0&size=102804&width=638&height=796&alt=",
        ingredients: "устрица в раковине;бекон;томаты конфи;соус Ворчестер;сырный соус;панировка панко-пармезан;шнитт лук",
        dishCategory: "Запеченные устрицы"
    },
    {
        name: "ЗАПЕЧЕНАЯ УСТРИЦА С БЕЛЫМИ ГРИБАМИ",
        price: 35,
        weight: "200 гр",
        calories: "400 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/5210d687-10b6-43ef-a0bb-ed378249a06f#media-blob-url=true&id=6c4473bb-dfdb-4f4e-a7f8-d009a58c59ba&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=-HgznOaMjDZY-VFFyah-0wXeQC560V04G0Jxcy2aqVl03oNDw4bIsbvoKufUx-pePLB3zkRKQOpIwSrEL4OeOeeQGqR_S2K4qrUr5fSPOK9dGKxkGoFtWFbI-VJfVA%3Ds0&size=112807&width=716&height=770&alt=",
        ingredients: "устрица в раковине;сырный соуc;белые грибы;сухари Панко-пармезан;шнитт лук",
        dishCategory: "Запеченные устрицы"
    },
    {
        name: "ЗАПЕЧЕНАЯ УСТРИЦА С ТРЮФЕЛЬНЫМ МАСЛОМ",
        price: 35,
        weight: "400 гр",
        calories: "520 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/05972ce6-49ff-438e-8bf1-13e09b198f38#media-blob-url=true&id=099ae12a-610e-43e8-947f-5b1f5d9a9224&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=sqQjs1s5vZwfWfTznp3tzhyNCt0P-0nhrQqhzc1ioxy_--5qYsCSSyT6TWEFFk_Gy5poGVGjRfdG45sAcF89GaHVMAYt_2JtpIZpGrfzFrAOotVuXGYQ9lh9G_Z2TA%3Ds0&size=100895&width=626&height=780&alt=",
        ingredients: "устрица в раковине;трюфельный крем;сырный соус;панировка панко-пармезан;шнитт лук",
        dishCategory: "Запеченные устрицы"
    },
    {
        name: "ЧИЗКЕЙК С КЛУБНИЧНЫМ СОУСОМ",
        price: 15,
        weight: "200 гр",
        calories: "250 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/18f564b1-1af6-47d3-b66c-db27848039e2#media-blob-url=true&id=f5e739c6-4956-497f-94ea-149bc846fc0f&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=0gS8U4cFzUuBD9E4dMO9m5OAWfmVaBV4uUIMOj6cIo0otvyMamNgJOGJnATh_LBFQVVc5G0sjN3NvA3sZNTzYXWsuXB95OEMsSRr3820iqeNm3kUcNiRAriH4X23fA%3Ds0&size=52173&width=400&height=600&alt=",
        ingredients: "сыр сливочный;сахар;яйца;сливки;клубничный соус",
        dishCategory: "Десерты"
    },
    {
        name: "ЛИМОННЫЙ ТАРТ",
        price: 12,
        weight: "105 гр",
        calories: "295 ккал",
        imageURL: "blob:https://itechart-vs.atlassian.net/679cc47a-156b-4f50-8de0-84a8f55648c2#media-blob-url=true&id=a0941990-43f0-44dc-a589-eeb2d3b650b3&collection=contentId-2818049&contextId=2818049&mimeType=image%2Fjpeg&name=eyba0sVbRQB-Ffr7M3IfTWm1D-IL7jRy-OKwPA-IhVGMm9IQ8bQzzFT9_OgbWi8IK99DbkIKcQjHp2nkOvDTyt---BbcdC-poVCm4Uv0mgM-EzEKnPM6vmBCtneZTg%3Ds0&size=71527&width=1200&height=1200&alt=",
        ingredients: "лимон;сахар;сливочное масло;яйцо;мука;меренга",
        dishCategory: "Десерты"
    }
]
// async function createDB() {
//     const menuRepo: Repository<Dish> = getRepository(Dish)
//     const dish: Dish[] = menuRepo.create(dishes)
//     await menuRepo.save(dish)
//     console.log('dishes succesfully added')
// }

export default dishes
