import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

const App = () => {
  const [baseCurrency, setBaseCurrency] = useState('THB')
  const [targetCurrency, setTargetCurrency] = useState('THB')
  const [inputAmount, setInputAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [fx, setFx] = useState({})

  const getRate = (baseCcy) => {
    return axios.get(`https://api.exchangeratesapi.io/latest?base=${baseCcy}`)
      .then( r => r.data)
      .catch( err => alert('couldn\'t get rate of ' + baseCcy))
  }

  useEffect(() => {
    const availableRate = ['THB', 'USD', 'JPY', 'EUR']
    Promise.all(availableRate.map( ccy => getRate(ccy)))
      .then( (result) => {
        const rates = result.reduce( (p, c) => Object.assign(p, {[c.base]: c.rates}), {})
        setFx(rates)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) return (<h1> Loading </h1>)

  return (
    <div>
      <h1> Currency exchange rate </h1>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-6'>
            <h2> Input </h2>
            <input
              type='number'
              value={inputAmount}
              onChange={(e)=> setInputAmount(e.target.value)}
              className='col-lg-12 field'
            />
            <div style={{margin: '4px 0px'}}>
              <button className={'col-lg-3 col-6 ' + (baseCurrency==='THB'?'active-ccy':'')} onClick={()=>setBaseCurrency('THB')}> THB </button>
              <button className={'col-lg-3 col-6 ' + (baseCurrency==='USD'?'active-ccy':'')} onClick={()=>setBaseCurrency('USD')}> USD </button>
              <button className={'col-lg-3 col-6 ' + (baseCurrency==='JPY'?'active-ccy':'')} onClick={()=>setBaseCurrency('JPY')}> JPY </button>
              <button className={'col-lg-3 col-6 ' + (baseCurrency==='EUR'?'active-ccy':'')} onClick={()=>setBaseCurrency('EUR')}> EUR </button>
            </div>
          </div>
          <div className='col-lg-6'>
            <h2> Output </h2>
            <input
              className='col-lg-12 field'
              value = {inputAmount * (baseCurrency===targetCurrency?1:fx[baseCurrency][targetCurrency])}
            />
            <div style={{margin: '4px 0px'}}>
              <button className={'col-lg-3 col-6 ' + (targetCurrency==='THB'?'active-ccy':'')} onClick={()=>setTargetCurrency('THB')}> THB </button>
              <button className={'col-lg-3 col-6 ' + (targetCurrency==='USD'?'active-ccy':'')} onClick={()=>setTargetCurrency('USD')}> USD </button>
              <button className={'col-lg-3 col-6 ' + (targetCurrency==='JPY'?'active-ccy':'')} onClick={()=>setTargetCurrency('JPY')}> JPY </button>
              <button className={'col-lg-3 col-6 ' + (targetCurrency==='EUR'?'active-ccy':'')} onClick={()=>setTargetCurrency('EUR')}> EUR </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default App;
