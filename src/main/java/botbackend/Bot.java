package botbackend;
import io.github.cdimascio.dotenv.Dotenv;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.util.Scanner;

import com.fasterxml.jackson.databind.ObjectMapper;

public class Bot {
    
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        String apiKey = dotenv.get("OPENAI_API_KEY");
        OpenAIClient client = OpenAIOkHttpClient.builder()
            .apiKey(apiKey)
            .build();

        Scanner scanner = new Scanner(System.in);

        System.out.println("Bot ready, type a question");

        while (true) {
            String input = scanner.nextLine();

            ResponseCreateParams params = ResponseCreateParams.builder()
                .input(input)
                .model("gpt-5.4-nano")
                .build();

            Response response = client.responses().create(params);
            System.out.println(response);
        }
    }



    
}