import { useState, useEffect } from "react";
import "./App.css";
import { Input } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [result, setResult] = useState("");
  const [currencyData, setCurrencyData] = useState(null);
  const toast = useToast();
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.currencyapi.com/v3/latest?apikey=cur_live_tZXMlQfLYRly9nqm2gbqrn89BJmBpxRClX1a7F3u`
        );
        const data = await response.json();
        setCurrencyData(data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  const handleConvert = () => {
    const fromRate = currencyData.data[fromCurrency].value;
    const toRate = currencyData.data[toCurrency].value;
    const convertedAmount = (amount * toRate) / fromRate;
    setResult(
      `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`
    );
    toast({
      title: "Currency Converted",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  return (
    <>
      <div className="container">
        <div className="image-cur">
          <img src="/coin.svg" alt="" className="image-image" />
        </div>
        <div className="title-cur">Currency Converter</div>
        <Input
          placeholder="Enter currency amount"
          className="input-cur"
          variant="flushed"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            const isNumeric = /^\d*\.?\d*$/.test(value);
            setIsInputEmpty(!isNumeric || value.trim() === "");
            if (isNumeric) {
              setAmount(value);
            }
          }}
        />
        <div className="buttons-container">
          <div className="left-container">
            <div className="mini-title">From</div>
            <Select
              placeholder="Select currency"
              className="select-cur"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencyData &&
                Object.keys(currencyData.data).map((currencyCode) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode}
                  </option>
                ))}
            </Select>
          </div>
          <div className="right-container">
            <div className="mini-title">To</div>
            <Select
              placeholder="Select currency"
              className="select-cur"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {currencyData &&
                Object.keys(currencyData.data).map((currencyCode) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode}
                  </option>
                ))}
            </Select>
          </div>
        </div>
        <div className="convert">
          <Button
            colorScheme="facebook"
            onClick={handleConvert}
            isDisabled={isInputEmpty}
          >
            Convert
          </Button>
        </div>
        <div className="result">{result ? result : "Nothing here yet"}</div>
      </div>
    </>
  );
}

export default App;
