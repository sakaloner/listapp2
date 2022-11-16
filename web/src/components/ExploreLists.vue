
  <template #fallback>
    <h1>Explorar listas de tus amigos y enemigos</h1>
    <div id="Listas">
      <!-- for each user -->
      <ul v-for="user in info_users">
        <ul v-for="categoria in user">
          <div class="lista_objects">
            <ul v-for="item in categoria">
              <h2>{{item.tipo}} from:{{item.owner_id}}</h2>
              <!-- <li>{{item}}</li> -->
              <li><a :href="item.link">{{item.titulo}}</a></li>
              <li>{{item.autor}}</li>
              <li>{{item.rating}}</li>
            </ul>
          </div>
        </ul>
      </ul>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useLoginStore } from '../stores/login';



onMounted(() => {
  // Tengo que buscar cuales son los amigos del men
  // tendre que refactorizarlo en algun momento y usar la tienda
  console.log(`the component is now mounted.`);
});


const username = localStorage.getItem('username');
const loginfo = useLoginStore();

function test_objects(){
  const user_followed = new Object();
  user_followed.username = "jose";
  user_followed.items = {
    'peliculas': ['peli1', 'peli2'],
  }
  console.log('object', user_followed);
};

function get_following(username) {
  // return un objeto con la infomacion de los "amigos"
  return new Promise(function (resolve, reject) {
    const info_following = new Object();
    axios.get('http://localhost:8000/multiplayer/view_following',{
      params:{
        folower: username
      },
      headers: {
      'accept': 'application/json'
      }
    })
    // getting the list of people the user follows (following)
    .then(function (response) {
      // We will create an object with the info of each following user
      
      // get the first element of each array on the response
      //console.log(response.data)
      let following = [];
      response.data.forEach(element => {
        //console.log('esto', element['folowee']);
        following.push(element['folowee']);
      });
      //console.log('response_get_following', following);
      return following

    })
    // getting the categories and items the following has
    .then(function (following_list) {
      //console.log('following', following_list);
      following_list.forEach(user_to_show => {

        axios.get(`http://localhost:8000/get_categories/${user_to_show}`,{
          headers: {
            'accept': 'application/json'
          }
        })
        // here ill get every element in the category. limit 5
        .then(function (response) {
          //console.log('user_to_show', user_to_show);
          //console.log('categoires', response.data);
          response.data.forEach(category => {
            axios.get('http://localhost:8000/',{
            params:{
              owner_id: user_to_show,
              tipo: category,
              limit: 5
            },
            headers: {
              'accept': 'application/json'
            }
            })
            .then(function (response_items) {
              if (response_items.data.length > 0) {
                info_following[user_to_show] = {
                  [category]: response_items.data
                };
                //console.log('user_to_show', user_to_show);
                //console.log('categories', category);
                //console.log('items', response_items.data);
              }

            })
            .then(function () {
              //console.log('info_following', info_following);
              resolve(info_following);
            })
            .catch(function (error) {
              console.log(error);
            });


          });  
        })
      })
    })
    .catch(function (error) {
      console.log('error de get following', error);
    });
  });

};

let info_users = await get_following(username);
let count = 0;
while (Object.keys(info_users).length === 0) {
  await new Promise(r => setTimeout(r, 2000));
};
console.log('Data populated')
console.log('info_users', info_users);

// get_following(username)
//   .then(function (info_following) {
//     console.log('info_following', info_following);
//     while (Object.keys(info_following).length === 0) {
//       console.log('esperando');
//     };
//     console.log('info_following', info_following['deyza']);
//   })





//get_categories(username);
// y de estos coger las listas
// el autput deben ser array con listas, con el nombre del duenio
// El nombre de la categoria y el autor de la meirda al final.

// function get_lists(page_value) {
//   let namero = localStorage.getItem('username');
//   // if (namero == null)  {
//   //   setTimeout(get_lists(page_value), 5000);
//   // }
//   console.log(namero);
//   axios.get('http://localhost:8000/', {
//       params: {
//         tipo: page_value,
//         owner_id: namero
//       }
//     })
//     .then(function (response) {
//       const {data} = response
//       console.log('res func', data, typeof(data));
//       lists.data = data
//       return data;
//     })
//     .catch(function (error) {
//       if (error.response.status == 401) {
//         error_msg.msg = 'Login to see your lists';
//         error_msg.show = true;
//         return 0;
//       } else {
//         error_msg.msg = 'Something went wrong';
//         error_msg.show = true;
//         console.log(error);
//         return error
//       }
//     });
// };

</script>


<style scoped>

</style>