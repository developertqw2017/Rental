import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ListView,
  ScrollView,
  AsyncStorage,
  ActivityIndicator
} from 'react-native'

import {Actions} from 'react-native-router-flux'

import Icon from 'react-native-vector-icons/MaterialIcons'
import Iconz from 'react-native-vector-icons/Ionicons'

import { List, ListItem } from 'react-native-elements'

import website_url from '../../../config'
const ACCESS_TOKEN = 'access_token'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Following extends Component{

  constructor(props){
      super(props);

      this.state = {
         dataSource : ds.cloneWithRows([]),
         loading: false,
         user_id: this.props.user_id
      }
  }

  async getFollowers(token){
    this.setState({loading: true})
    let url = website_url + "api/v1/accounts/"+ this.state.user_id + "/following/"
    let data = {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Token ' + token
      }
   }

     fetch(url, data)
        .then(response => response.json())
        .then(jsonData => {
           this.setState({
              dataSource: this.state.dataSource.cloneWithRows(jsonData.results),
              loading: false
           })
        })
        .catch(error =>{
            this.setState({loading: false})
        })
  }

  componentWillMount(){
    global.tracker.trackScreenView("Following")
      AsyncStorage.getItem(ACCESS_TOKEN).then((TOKEN) => {
          this.getFollowers(TOKEN)
      })

  }

  nav(){
   return(
    <View style={styles.nav1}>
      <TouchableOpacity onPress={() => Actions.pop()} style={{flex:1, alignItems:'flex-start', justifyContent:"center"}}>
          <Iconz name = "ios-arrow-round-back-outline" color="#222" size={40} style={{margin:3,}} />
      </TouchableOpacity>
      <View style={{flex:1}}>
         <Text style={{fontSize:20, color: 'black'}}>
             关注
         </Text>
      </View>
      <View style={{flex:1}}>
      </View>
    </View>
    )
 }

  renderRow (rowData, sectionID) {

    return (
            <TouchableOpacity onPress={() => Actions.view_profile({'user_id': rowData.id, 'anonymous': false})}>
                <ListItem
                  roundAvatar
                  key={sectionID}
                  title={rowData.username}
                  subtitle={rowData.fullName}
                  avatar={{uri: rowData.image}}
                />
            </TouchableOpacity>
    )
  }

  render () {
      if(this.state.loading){
          return(
            <View style={styles.loading}>
                <ActivityIndicator size='large' />
           </View>
          )
      }else{
          return (
            <View style={styles.container}>
                {this.nav()}
                <List>
                  <ListView
                    enableEmptySections={true}
                    renderRow={this.renderRow}
                    dataSource={this.state.dataSource}
                  />
                </List>
            </View>
        )
      }
  }
}



const styles = StyleSheet.create({
   container: {
      flex:1
   },
   nav1:{
     flexDirection:'row',
     borderBottomWidth:1,
     borderBottomColor:'#e7e7e7',
     justifyContent:'space-between',
     alignItems:'center',
     height:50,
   },
   loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
