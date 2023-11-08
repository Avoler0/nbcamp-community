const { default: axios } = require("axios");
const dotenv = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");

dotenv.config()
const testRouter = express.Router();

// testRouter.get('/',(req,res)=>{
//   res.send(`<a href="https://localhost:8080/test/slack">Add to Slack</a>`)
// })

// testRouter.get("/", (req, res) => {
//   res.send(`
//     <a href="https://slack.com/oauth/v2/authorize?client_id=6174133181233.6161471686963&scope=&user_scope=email"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
//   `);
// });

testRouter.get('/',async (req,res)=>{
  console.log(process.env.SLACK_CLIENT_ID)
  const scope = `openid%20profile%20email%groups:read%channels:read`
  const result = await axios.get(`https://slack.com/openid/connect/authorize?response_type=code&scope=${scope}&client_id=${process.env.SLACK_CLIENT_ID}&redirect_uri=https://localhost:8080/test/slack`)
  .then((res)=> res)
  .catch((err) => console.log(err,'에러'))

  res.send(`<div>${result.data}</div>`)
})

testRouter.get('/slack',async (req,res) => {
  const { code } = req.query;
  const data = {
    client_id:process.env.SLACK_CLIENT_ID,
    client_secret:process.env.SLACK_CLIENT_SECRET,
    code:req.query.code,
    redirect_uri:'https://localhost:8080/test/slack'
  }

  const result = await axios.post(`https://slack.com/api/openid.connect.token`,null,{
    params:data
  })
  const info = jwt.decode(result.data.id_token);

  console.log(info)
  
  res.status(200).send(info)
})


testRouter.get('/slack/test/ok',async (req,res) => {
  console.log('오케이')

  res.send('오케이')
})
module.exports = testRouter;