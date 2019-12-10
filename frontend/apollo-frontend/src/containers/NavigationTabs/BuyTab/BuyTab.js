
import React from 'react';
import {
  Grid,
  Segment,
  Header,
  Item,
  Label,
  Button,
  Card,
  Divider,
  Dimmer,
  Loader,
  Image,
  Input,
  Checkbox,
  Icon,
  Message,
  Dropdown,
  Container,

} from 'semantic-ui-react';
import axios from 'axios';

//lets you recieve props from the parent component (in this case, NavigationTabs.js)
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux';


import {
    addItemToCart
  } from '../../../store/actions/cart';

import {
    productListURL,
    addToCartURL,
    productSearchListURL,
    categoryListURL,
    productSearchByCategoryURL,

  } from '../../../constants';

import FeaturedItems from './FeaturedItems'

/*
WORK TO BE DONE:
  make a 'product item' component so that it can just get passed into the loops that create all the active items, instead of having all that code twice

*/




class BuyTab extends React.Component {

  state = {
    loading: false,
    error: null,
    data: [],
    displayingCategories: [],
    value: '',
    productsTitle: 'Featured Items',
    filterTitle: '',
    filterCategory: '',
    filteredData : [],

    allCategories: [],
    activeDisplayItemsByCategory: 'featured'
  }


  componentDidMount() {
    // this.setState({
    //   loading: true
    // });
    // this.handleGetProducts();
    this.handleGetCategories();

  };



  // handleGetProducts = () => {
  //   //gets the products from the database and stores them in the state or it returns the error
  //   axios
  //   .get(productListURL)
  //   .then(response => {
  //     //gets the individual categories from the response data
  //     let cats = []
  //     response.data.map( (item) => {
  //       if(!cats.includes(item.category)){
  //         cats = cats.concat(item.category)
  //       }
  //     })
  //     this.setState({data: response.data, loading: false, displayingCategories: cats});
  //   })
  //   .catch(error => {
  //     this.setState({error: error, loading: false});
  //   })
  // }




  // handleAddToCart = (data, quantity) => {
  //   this.setState({ loading: true });
  //   const {formData} = this.state;
  //   //filters  the data into the correct format fot the backend
  //   const variations = []
  //   this.props.addItemToCart(data, quantity, variations)
  //   this.setState({loading: false});
  //
  // }




  //if the user presses enter on the search bar, it'll search for the value (currently stored in this.state.value)
  handleSearchEnterPress = (event) => {
    //this.setState({value: data.value});
    //console.log('data from handleSearchEnterPress: ', data)
    let search = this.state.value

    // console.log('search from handleSearchEnterPress: ', search)
    if (event.key === "Enter") {
      //if the user hits enter (tries to search) then return the search results.. need to change the views.py for this a little bit
      axios
      .get(productSearchListURL, {
        params: {
          search: search
          }
        })
      .then(response => {
        //if the search bar is empty, make the title say 'featured products'
        //the issue is if the user searches for something, then erases it from the search bar and hits enter it'll say 'search results for "" []' when it is displaying the featured products
        if(search === ''){
          this.setState(
            {
              data: response.data,
              loading: false,
              productsTitle: 'Featured Items'}
          );
        }else{
          this.setState(
            {
              data: response.data,
              loading: false,
              productsTitle: `Search results for "${search}" [${response.data.length}]`}
          );
        }
      })
      .catch(error => {
        this.setState({
          error: error,
          loading: false
        });
      })
      // console.log('enter pressed');
    }
  }

  handleGetCategories = () => {
    axios
    .get(categoryListURL)
    .then( response => {
      this.setState({allCategories: response.data, loading: false})
    })
    .catch(error => {
      this.setState({error: error , loading: false})
    })
  }


  handleFilterDisplayCategoryButtonPressed = (e, data) => {
    console.log('onclick data: ', data)
    if(data.checked){
      //filterCategory is how the checkboxes uncheck when another is checked (the logic is in the 'checked' prop in the checkbox (category === checkedCategory))
      this.setState({
        filterCategory : data.name,
      })
      console.log('handleFilterButtonPressed data.name: ', data.name)
      //creates an array to handleFilterDisplayCategoryButtonPressed the filtered items, and loops through the state.data and compares it to the selected checkbox, if they match it is added to  the filteredData array
      let filteredItems = []
      this.state.data.map( item => {
        if(item.category === data.name){
          filteredItems = filteredItems.concat(item)
        }
      })
      console.log('handleFilterDisplayCategoryButtonPressed filtereditems: ', filteredItems)
      //filterTitle just displays the name of the filter category.. gets appended to the end of the products title on the page
      this.setState({
        filteredData: filteredItems ,
        filterTitle: `, filtered by "${data.name}"`
      })
    }else if (!data.checked){
      //sets the filter category to a blank string (this is incase the user checks the same box again )
      this.setState({
        filterCategory: '',
        filterTitle: ''
      })
    }
  }


  handleDisplayViewItemsByCategory = (e, data) => {
    let cat = ''
    switch (data.content){
      case 'Featured':

      case 'Technology':
        cat = 'T'
        break;
      case 'Outdoors':
        cat = 'OD'
        break;
      case 'Apparel':
        cat = 'A'
        break;
      case 'Books':
        cat = 'B'
        break;
      case 'Miscellaneous':
        cat = 'M'
        break;
      default:
        return 'error'

    }
    axios
    .get(productSearchByCategoryURL, {
      params: {
        category: cat
        }
      })
    .then(response => {
      console.log('response.data: :' , response.data,)
      this.setState({
          data: response.data,
          loading: false,
          //productsTitle: `Search results for "${search}" [${response.data.length}]`}
        });

    })
    .catch(error => {
      this.setState({
        error: error,
        loading: false
      });
    })

    console.log('data: ', data)
    this.setState({
      activeDisplayItemsByCategory: data.content
    })
  }






  //this should be a component to create an item. make this so that it will display the product item, should get put in a loop when displaying the current items
  makeProductItem = (item) => {
    console.log('makeproductitem item: ' , item)
  }





  render(){

    const {
      data,
      error,
      loading,
      displayingCategories,
      value,
      productsTitle,
      filterCategory,
      filteredData,
      filterTitle,
      allCategories,
      activeDisplayItemsByCategory,

     } = this.state;


    return(

      <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            <Input
              fluid
              label={
                <Dropdown
                  defaultValue='all'
                  options={[
                    { key: '0', text: 'All Categories', value: 'all' },
                    { key: '1', text: 'Outdoors', value: 'Outdoors' },
                    { key: '2', text: 'Apparel', value: 'Apparel' },
                    { key: '3', text: 'Books', value: 'Books' },
                    { key: '4', text: 'Miscelaneous', value: 'Miscelaneous' },
                    { key: '5', text: 'Technology', value: 'Technology' },
                  ]}
                />
              }
              icon='search'
              placeholder='Search for an item...'
              onKeyPress={this.handleSearchEnterPress}
              onChange={
                //sets the search value into the value in the state
                (e,data)=>{
                  this.setState({value: data.value});
                }
              }
            />
          </Grid.Column>

          {/*this is for the "all categories" button group*/}

            {/*ths inline Style is what makes the items align horizontally*/}
            <Container
              style={{display: 'flex', alignItems: 'center'}}
            >
              <Button basic compact >
               All Categories:
              </Button>

              <Button.Group>
                <Button
                  compact
                  content='Featured'
                  active={activeDisplayItemsByCategory === 'featured'}
                  onClick={(e, data) => {
                    this.handleDisplayViewItemsByCategory(e, data)
                  }}
                />

                {
                  allCategories.map(category => {
                    return(
                      <Button
                        compact
                        content={category.category}
                        active={activeDisplayItemsByCategory === category.category}
                        onClick={(e, data) => {
                          this.handleDisplayViewItemsByCategory(e, data)
                        }}
                      />
                    )
                  })
                }
              </Button.Group>
            </Container>


        </Grid.Row>


        <FeaturedItems />

      </Grid>
    //ends the return statement
    )
  }
}


// const mapDispatchToProps = (dispatch) => {
//   return {
//     addItemToCart: (data, quantity) => dispatch(addItemToCart(data, quantity)),
//
//   }
// }




// export default
//   withRouter(
//     connect(
//       null,
//       mapDispatchToProps
//     )
//     (BuyTab)
//   );


export default BuyTab
