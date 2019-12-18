
//file created in https://youtu.be/Zg-bzjZuRa0?t=109

import React from 'react';
import {withRouter} from 'react-router-dom';
import {
  Button,
  Image,
  Item,
  Label,
  Container,
  Segment,
  Loader,
  Dimmer,
  Message,
  Card,
  Grid,
  Header,
  Form,
  Divider,
  Select,
  Comment,
  Dropdown,
  Input,

} from 'semantic-ui-react';
import NumberInput from 'semantic-ui-react-numberinput';
import axios from 'axios';
import {connect} from 'react-redux';
import ls from 'local-storage';



//don't really use this at all
import {
  productDetailURL,
  addToCartURL,
  productReviewListURL,

} from '../constants'
import {authAxios} from '../utils';
import {
  mergeCartOnLogin,
  addItemToCart,

 } from '../store/actions/cart';


/*
  need to figure out how to give an accurate price for multiple variations
    (it may not be simple addition.. ex: a color & size combination may change based on every different permutation )
    may need to send in an array of every permutation and price associated with it.. this could be a large array tho
    (ex: paracord with 5 different lengths each offered in 12 different colors. potentially 72 different combinations with 72 different prices)
*/




class ProductDetail extends React.Component {


  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    formData: {},
    quantity: '1',
    submitted: false,
    reviews: []
  }

  componentDidMount() {
    this.handleFetchItem();
    this.handleFetchReviews();
    //this.props.mergeCartOnLogin();
  }

  //retrieves the product info from the database
  handleFetchItem = () => {
    //had to change this from the tutorials becuase my log was slightly different
    const productID = this.props.match.params.productID;
    this.setState({ loading: true});
    axios
      .get( productDetailURL(productID) )
      .then(res => {
        console.log('item data: ', res.data)
        this.setState({data: res.data, loading: false});
        // console.log('handlefetchitem productDetail response data : ', res.data)
      })
      .catch(err =>{
        this.setState({error: err, loading: false});
      });
  }




  handleAddToCart = (data, quantity) => {

    console.log('data from addtocart: ' , data)
    const slug = data.slug

    // console.log('quanityt from handleaddtocart: ', quantity)
    this.setState({ loading: true });
    const {formData} = this.state;
    //filters  the data into the correct format fot the backend
    const variations = [] //this.handleFormatData(formData);

    //console.log('variations from handleaddtocart : ', variations)

    this.props.addItemToCart(data, quantity, variations)

    this.setState({loading: false});

  }


  handleFetchReviews = () => {
    const productID = this.props.match.params.productID;
    this.setState({loading: true});
    axios
    .get(productReviewListURL(productID))
    .then(res => {
      this.setState({reviews: res.data, loading: false});
      // console.log("reviews: ", res)
    })
    .catch(err => {
      this.setState({error: err, loading: false});
    })
  }

  //made at https://youtu.be/qJN1_2ZwqeA?t=1386
  handleFormatData = (formData) => {
    //returns the keys of the formData array becuase that is what the backend is expecting
    //convert {color: 1, size:2} to [1,2]
    return Object.keys(formData).map(key =>{
      return formData[key];
    })
  }











  handleChange = (e, {name, value}) => {
    //made around https://youtu.be/qJN1_2ZwqeA?t=1126
    const {formData} = this.state
    const updatedFormData = {
      //spread of the formData
      ...formData,
      //changes the name of the key to be the value (this is for passing info to the backend.. ex. changes the name "red" to 1)
      [name]: value
    }
    this.setState({
      formData: updatedFormData
    })

  }


  //used to increase the product quantity in the State
  changeValue = (newValue) => {
        this.setState({ quantity: newValue });
  }


  render() {

      const {
          data,
          error,
          formData,
          formVisible,
          loading,
          quantity,
          submitted,
          reviews,

        } = this.state;

      return (

        <Container fluid>
            {
              error &&

                <Message
                  error
                  header='It appears that there was an error with your submission. Please double check that you selected all required variations'
                  content={ JSON.stringify(error.message) }
                />
            }
            {
              //displays a message when the user adds the item to their cart
              submitted &&
              (
                <Message
                  positive
                  header='Thanks!'
                  content={ submitted }
                />
              )
            }

            {
              //if loading is true then render the loader component
              //if false, render the page content (product info, add-to-cart widget)
              loading ?
              (
                <Segment>
                    <Dimmer active inverted>
                      <Loader inverted>Loading</Loader>
                    </Dimmer>

                    <Image src='/images/wireframe/short-paragraph.png' />
                </Segment>
              )
              :
              (


                <Grid columns={3} >

                  <Grid.Column width={4} floated='right' >

                      <Header as='h1' dividing>
                        {data.title}
                        {
                          data.discount_price !== null ? (
                             <React.Fragment>
                              <Label className='price' style={{ textDecorationLine: 'line-through' }}>${data.price}</Label>
                              <Label className='stay' >{data.discount_price}</Label>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <Label className='price' >${data.price}</Label>
                            </React.Fragment>
                          )
                        }
                      </Header>

                      <Card>
                        <Image src={data.image} />
                        <Card.Content>
                          <Card.Description>
                            try to put a image carousel in here for multiple images
                          </Card.Description>
                        </Card.Content>
                      </Card>


                  </Grid.Column>



                    {/*column for displaying the product info AND reviews*/}
                    <Grid.Column width={8}>

                      <Container text style={{marginTop: '5%'}}>
                        <Header>
                          Product Information
                        </Header>
                        <Item.Description>{data.description}</Item.Description>
                      </Container>

                      <Divider />


                      <Container text style={{marginTop: '3%'}}>
                        <Comment.Group >
                          <Header as='h3' dividing>
                            Customer Reviews
                          </Header>
                          {
                            reviews.length > 0 ?
                              reviews.map(review => {
                                var date = new Date( review.date );
                                var dateString = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                                return(
                                  <Comment>
                                    {/* <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' /> */}
                                    <Comment.Content>
                                      <Comment.Author as='a'>{review.user}</Comment.Author>
                                      <Comment.Metadata>
                                        <div>{dateString}</div>
                                      </Comment.Metadata>
                                      <Comment.Text>
                                        {review.review_content}
                                      </Comment.Text>

                                    </Comment.Content>
                                  </Comment>
                                )
                              })
                              :
                              <Message
                                style={{backgroundColor: 'white'}}
                              >
                                There are no customer reviews for this product yet, but we think that its great! <p>Agree with us? Write a review for this item in your profile</p>
                              </Message>
                          }
                        </Comment.Group>
                      </Container>
                    </Grid.Column>


                    {/*Column for holding the add-to-cart widget and the different variations of the product*/}
                    <Grid.Column width={4}>
                      <Container text >

                        <Card >
                          <Card.Content>

                            <Card.Header>Quantity:</Card.Header>
                            <NumberInput

                              float='right'
                              size='mini'
                              value={this.state.quantity}
                              minValue={1}
                              onChange={this.changeValue}
                              doubleClickStepAmount={3}
                            />

                          </Card.Content>
                          <Card.Content extra>
                            <Button
                              fluid

                              color='blue'
                              onClick={() => {
                                this.handleAddToCart(this.state.data, this.state.quantity )
                                }
                              }
                            >
                              Add to Cart
                            </Button>



                            <Button
                              style={{marginTop: '3%'}}
                              fluid
                              color='blue'
                            >
                              <Dropdown
                                text='Buy now with 2-Click'
                                direction='left'
                              >
                                <Dropdown.Menu>
                                  <Dropdown.Item>

                                    <p>
                                      hello world, welcome to '2-click' purchasing.
                                    </p>
                                    <p>
                                      this is strictly a demo/layout for the real deal
                                    </p>
                                    <p>
                                      *insert shpeal about incorrect addresses here*
                                    </p>


                                    <Card>
                                      <Card.Content>
                                        <Card.Header>Bitcoin</Card.Header>
                                        <Card.Meta>click to display a scannable QR code</Card.Meta>
                                        <Card.Description>
                                          <Input
                                            action={{
                                              icon: 'copy',
                                            }}
                                            defaultValue='47dm93050jd02jm,ka7ifa'
                                          />
                                        </Card.Description>
                                      </Card.Content>
                                      <Card.Content>
                                          $429104/<Label color='yellow'>₿1.3349103</Label>
                                      </Card.Content>
                                    </Card>


                                    <Card>
                                      <Card.Content>
                                        <Card.Header>Litecoin</Card.Header>
                                        <Card.Meta>click to display a scannable QR code</Card.Meta>
                                        <Card.Description>
                                          <Input
                                            action={{
                                              icon: 'copy',
                                            }}
                                            defaultValue='158df8asdf50jd02jm,ka7ifa'
                                          />
                                        </Card.Description>
                                      </Card.Content>
                                      <Card.Content>
                                          $429104/ <Label color='blue'>Ł 19.3349103</Label>
                                      </Card.Content>
                                    </Card>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Button>
                          </Card.Content>
                        </Card>


                        {/* "if variations exists, then display this for every variation" */}
                        {
                          data.variations &&
                          (
                            data.variations.map(variation => {
                              return(
                                <Card>
                                  <Card.Content>
                                    <Card.Header>{variation.name}</Card.Header>
                                    <Form.Field>
                                      <Select
                                        fluid
                                        name={variation.name}
                                        onChange={this.handleChange}
                                        options={
                                            variation.item_variations.map(item=>{
                                              return {
                                                key: item.id,
                                                text: `${item.value}`,
                                                value: item.id,
                                              }
                                            })
                                          }
                                        placeholder={`choose a ${variation.name} option`}
                                        selection
                                        value={formData[variation.name]}
                                      />
                                    </Form.Field>
                                  </Card.Content>
                                </Card>
                              )
                            })
                          )
                        }

                      </Container>

                    </Grid.Column>
                </Grid>

              )
            }

        </Container>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    cart: state.cart.shoppingCart,
  };
};



const mapDispatchToProps = (dispatch) => {
  return {
    mergeCartOnLogin: () => dispatch(mergeCartOnLogin()),
    addItemToCart: (data, quantity) => dispatch(addItemToCart(data, quantity)),
  }
}

export default
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
    (ProductDetail)
  );
