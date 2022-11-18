
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


const getUsers = async () => { 
  console.log('trying')
  const followingUsers = await axios.get('http://localhost:8000/multiplayer/view_following',{
      params:{
        folower: username
      },
      headers: {
      'accept': 'application/json'
      }
  }).catch((err) => {
    console.log(err)
  });
  console.log('followingUsers', followingUsers.data)
  let users = {};
  await followingUsers.data.forEach(async (element) => {
    
    const categories = await axios.get(`http://localhost:8000/get_categories/${element.folowee}`,{
      headers: {
        'accept': 'application/json'
      }
    }).catch((err) => {
      console.log(err)
    });
    categories.data.forEach(async (element2) => {
      const items = await axios.get('http://localhost:8000/',{
        params:{
          owner_id: element.folowee,
          tipo: element2,
          limit: 5
        },
        headers: {
          'accept': 'application/json'
        }
      }).catch((err) => {
        console.log(err)
      });
      if (items.data.length > 0) {
        console.log(element);
        users[element.folowee] = {
          [element2]: items.data
        };
      };
    });
  });
  return users;
};



//getUsers(username).then(users=> console.log(Object.entries(users), users));
let info_users = await getUsers(username);

while (Object.keys(info_users).length === 0) {
  await new Promise(r => setTimeout(r, 2000));
};
console.log('Data populated')
console.log('info_users', info_users);

</script>


<style scoped>

</style>