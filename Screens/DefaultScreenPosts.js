import React, { useEffect, useState } from "react";
import {Text, View, StyleSheet, FlatList, Image, Button} from "react-native"


const DefaultScreenPosts = ({route, navigation}) => {
    const [posts, setPosts] = useState([]);
    useEffect(()=> {
        if(route.params){
            setPosts(prevState => [...prevState, route.params])
        }
    },[route.params]);
    console.log('posts', posts)
    return (
        <View style={styles.container}>
           <FlatList 
            data={posts} 
            keyExtractor={(item, indx)=> indx.toString()} 
            renderItem={({item})=> (
                <View style={{marginBottom: 16, justifyContent: 'center', alignItems: 'center'}}>
                    <Image 
                        source={{uri: item.photo}} 
                        style={{width: 350, height: 200}}/>
                </View>
            )}/>
            <Button title="go to map" onPress={()=> navigation.navigate('Map')}/>
            <Button title="go to Comment" onPress={()=> navigation.navigate('Comments')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginTop: 32,
        
    }
})

export default DefaultScreenPosts;