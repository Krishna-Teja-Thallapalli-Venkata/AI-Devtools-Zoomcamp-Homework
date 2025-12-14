const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const { server, io } = require("../index"); // Import the server instance

describe("Interview Platform Integration Tests", () => {
    let clientSocket1, clientSocket2;
    let httpServer, httpServerAddr;

    beforeAll((done) => {
        // Start the server on a random port
        server.listen(() => {
            const port = server.address().port;
            clientSocket1 = new Client(`http://localhost:${port}`);
            clientSocket2 = new Client(`http://localhost:${port}`);

            // Wait for both to connect
            let connectedCount = 0;
            const onConnect = () => {
                connectedCount++;
                if (connectedCount === 2) {
                    done();
                }
            };

            clientSocket1.on("connect", onConnect);
            clientSocket2.on("connect", onConnect);
        });
    });

    afterAll(() => {
        server.close();
        clientSocket1.close();
        clientSocket2.close();
    });

    test("should broadcast code change to other users in the same room", (done) => {
        const roomId = "test-room-1";
        const testCode = "console.log('Hello World');";

        // Both join the room
        clientSocket1.emit("join-room", roomId);
        clientSocket2.emit("join-room", roomId);

        // Allow some time for join to process (though socket.io is fast)
        setTimeout(() => {
            // Setup listener on client 2
            clientSocket2.on("code-update", (code) => {
                try {
                    expect(code).toBe(testCode);
                    done();
                } catch (error) {
                    done(error);
                }
            });

            // Emit change from client 1
            clientSocket1.emit("code-change", { roomId, code: testCode });
        }, 50);
    });
});
