import http from "http";

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/submit") {
    let body;
    async function fetchData(pageNo) {
      const data = await fetch(`https://reqres.in/api/users?page=${pageNo}`)
        .then((res) => res.json())
        .then((res) => {
          console.log("Done");
          return res;
        });

      return data;
    }
    //fetchData();
    //When you use req.on("data", ...), the data is received in chunks. This is because HTTP requests can be quite large, and streaming the data in chunks helps manage memory usage more efficiently

    //Once all chunks have been received, the end event is emitted, indicating that the entire request body has been received and can be processed.
    req.on("data", (chunk) => {
      //Here we are using closures since this body is outer scope body variable
      body = chunk.toString();
    });

    //Once all the data has been received, Node.js emits the end event
    req.on("end", async () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      //Here we are using closures since this body is outer scope body variable
      let data = await fetchData(JSON.parse(body).key);
      res.end(
        JSON.stringify({
          message: "Data received",
          data: data.data,
        })
      );
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
