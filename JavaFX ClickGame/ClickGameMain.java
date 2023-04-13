import javafx.animation.AnimationTimer;
import javafx.application.Application;
import javafx.geometry.Point2D;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.text.Font;
import javafx.scene.text.TextAlignment;
import javafx.stage.Stage;
import javafx.event.Event;
import javafx.scene.input.MouseButton;

import java.io.File;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

public class ClickGameMain extends Application {

  Pane mainPane;
  AnimationTimer gameLoop;
  Scene scene;
  Random rand = new Random();
  ArrayList<Circle> circles = new ArrayList<>();
  ArrayList<Point2D> velocities = new ArrayList<>();
  int score = 0;
  boolean gameStarted = false;
  Label scoreLabel = new Label("Circles Clicked: 0/20");
  Label timeLabel = new Label("Time: 0.0");
  Label highscores;
  double[] h = new double[3];
  double sessionHigh = -1.0;
  ArrayList<String> hNames = new ArrayList<>();
  Button startGame = new Button("Start Game");
  Label endTimeLabel = new Label();
  BorderPane root;
  VBox endGame = new VBox();
  StackPane center = new StackPane();
  public ArrayList<Particle> particles = new ArrayList<>();
  String[] endQuotes = new String[] {"New High Score! Good shit kid", "Click King",
      "You made the leaderboard! Not Bad", "Leaderboard is nice, but it's not #1",
      "Pretty good, I've seen better", "Well I can tell you're trying",
      "It's not that hard to click circles... right?", "Just click faster, nothing else to say",
      "A turtle could click faster than you", "My grandma could click faster than you",
      "CLICK FASTER", "A lower time is a better score...\njust in case you didn't know",
      "You're telling me it took you more than a minute\nto click 20 circles?"};



  @Override public void start(Stage stage) throws Exception {
    readInHighScores();
    root = new BorderPane();
    scene = new Scene(root, 750, 750);
    mainPane = new Pane();

    endGame.setAlignment(Pos.CENTER);
    endTimeLabel.setFont(new Font("Courier New", 25));
    endTimeLabel.setTextFill(Color.DARKBLUE);
    endTimeLabel.setTextAlignment(TextAlignment.CENTER);
    root.setBottom(highscores);
    BorderPane.setAlignment(highscores, Pos.CENTER);
    HBox topBar = new HBox(scoreLabel, timeLabel);
    topBar.setAlignment(Pos.CENTER);
    topBar.setSpacing(10);
    root.setTop(topBar);
    timeLabel.setFont(new Font("Courier New", 20));
    timeLabel.setTextFill(Color.BLUE);
    scoreLabel.setFont(new Font("Courier New", 20));
    scoreLabel.setTextFill(Color.BLUE);
    root.setCenter(center);

    center.getChildren().add(mainPane);
    center.getChildren().add(startGame);

    BorderPane.setAlignment(startGame, Pos.CENTER);
    startGame.setOnMousePressed((e) -> {
      center.getChildren().remove(startGame);
      center.getChildren().remove(endGame);
      timeLabel.setText("Time: 0.0");
      scoreLabel.setText("Circles Clicked: 0/20");
      loadGame();
      startGame();
    });



    stage.setTitle("Click Game");
    stage.setScene(scene);
    stage.show();
  }

  public void loadGame() {
    score = 0;
    for (int i = 0; i < 20; ++i) {
      addCircle();
    }
  }

  public void readInHighScores() {
    try {
      Scanner scnr = new Scanner(new File("Highscores.txt"));
      scnr.nextLine();
      for (int i = 0; i < 3; ++i) {
        scnr.next();
        h[i] = scnr.nextDouble();
        //hNames.add(scnr.next());
      }

      highscores =
          new Label("High Scores (seconds):\n1st: " + h[0] + " 2nd: " + h[1] + " 3rd: " + h[2]
              + "\nSession Best: ----");
      highscores.setFont(new Font("Courier New", 20));
      highscores.setTextFill(Color.BLUE);
      highscores.setTextAlignment(TextAlignment.CENTER);

    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public class Particle {

    final static double RADIUS = 5;
    final Color COLOR = new Color(rand.nextDouble(), rand.nextDouble(), rand.nextDouble(), 0.8);
    Circle circle;
    Point2D vel;
    int life = (int) (rand.nextGaussian() * 10);

    public Particle(double x, double y, double xVel, double yVel) {
      this.circle = new Circle(x, y, RADIUS, COLOR);
      circle.setOnMousePressed(e -> {
        for (Circle c : circles) {
          if (e.getX() < c.getCenterX() + c.getRadius()
              && e.getX() > c.getCenterX() - c.getRadius()
              && e.getY() < c.getCenterY() + c.getRadius()
              && e.getY() > c.getRadius() - c.getRadius()) {
            ArrayList<Circle> newCircles = new ArrayList<>(circles);
            makeParticles(e);
            ++score;
            scoreLabel.setText("Circles Clicked: " + score + "/20");
            mainPane.getChildren().remove(c);
            velocities.remove(circles.indexOf(c));
            newCircles.remove(c);
            circles = newCircles;
          }
        }
      });
      this.vel = new Point2D(xVel, yVel);
    }
  }



  public void makeParticles(MouseEvent event) {
    for (int i = 0; i < 20; ++i) {
      Particle p = new Particle(event.getX(), event.getY(), rand.nextDouble() * 2 - 1,
          rand.nextDouble() * 2 - 1);
      particles.add(p);
      mainPane.getChildren().add(p.circle);
    }
  }

  public void moveParticles() {
    if (!particles.isEmpty()) {
      ArrayList<Particle> newParticles = new ArrayList<>(particles);
      for (Particle p : particles) {
        p.circle.setCenterX(p.circle.getCenterX() + p.vel.getX());
        p.circle.setCenterY(p.circle.getCenterY() + p.vel.getY());
        if (p.life++ > 60 * 1) {
          mainPane.getChildren().remove(p.circle);
          newParticles.remove(p);
          particles = newParticles;
        }
      }
    }

  }

  public void addCircle() {
    Circle c = new Circle(rand.nextDouble() * mainPane.getWidth(),
        rand.nextDouble() * mainPane.getHeight(), 15);
    c.setStroke(Color.BLACK);
    c.setStrokeWidth(2);
    c.setFill(Color.RED.deriveColor(1, 1, 1, .5));
    c.setOnMousePressed((e) -> {
      makeParticles(e);
      gameStarted = true;
      ++score;
      scoreLabel.setText("Circles Clicked: " + score + "/20");
      mainPane.getChildren().remove(c);
      velocities.remove(circles.indexOf(c));
      circles.remove(c);

    });


    mainPane.getChildren().add(c);
    velocities.add(new Point2D(rand.nextDouble() * 2 - 1, rand.nextDouble() * 2 - 1));
    circles.add(c);
  }

  public void moveCircles() {
    for (int i = 0; i < circles.size(); ++i) {
      circles.get(i).setCenterX(circles.get(i).getCenterX() + velocities.get(i).getX());
      circles.get(i).setCenterY(circles.get(i).getCenterY() + velocities.get(i).getY());
    }
  }

  public void checkBounds() {
    for (int i = 0; i < circles.size(); ++i) {
      if (circles.get(i).getCenterX() >= mainPane.getWidth() - circles.get(i).getRadius()) {
        velocities.set(i, new Point2D(velocities.get(i).getX() * -1, velocities.get(i).getY()));
        circles.get(i).setCenterX(mainPane.getWidth() - circles.get(i).getRadius());
      } else if (circles.get(i).getCenterX() <= circles.get(i).getRadius()) {
        velocities.set(i, new Point2D(velocities.get(i).getX() * -1, velocities.get(i).getY()));
        circles.get(i).setCenterX(circles.get(i).getRadius());
      }

      if (circles.get(i).getCenterY() >= mainPane.getHeight() - circles.get(i).getRadius()) {
        velocities.set(i, new Point2D(velocities.get(i).getX(), velocities.get(i).getY() * -1));
        circles.get(i).setCenterY(mainPane.getHeight() - circles.get(i).getRadius());
      } else if (circles.get(i).getCenterY() <= circles.get(i).getRadius()) {
        velocities.set(i, new Point2D(velocities.get(i).getX(), velocities.get(i).getY() * -1));
        circles.get(i).setCenterY(circles.get(i).getRadius());
      }
    }
  }

  public void writeScoreToHighScores(double time) {
    try {
      time = Math.round(time * 10d) / 10d;

      int changed = 0;

	if (time < h[2] && time >= h[1]) {
		h[2] = time;
		changed = 3;
	}
	else if (time < h[1] && time >= h[0]) {
		h[2] = h[1];
		h[1] = time;
		changed = 2;
	}
	else if (time < h[0] && time > 0.0) {
		h[2] = h[1];
		h[1] = h[0];
		h[0] = time;
		changed = 1;
	}

    if (sessionHigh < 0 || sessionHigh > time) {
      sessionHigh = time;
    }

      if (changed != 0) {

        switch (changed) {
          case 1:
            endTimeLabel.setText("Your Time: " + time + "\n" + endQuotes[rand.nextInt(2)]);
            highscores.setText(
                "High Scores (seconds):\n1st: *" + h[0] + "* 2nd: " + h[1] + " 3rd:" + " " + h[2]
                 + "\nSession Best: " + sessionHigh);
            break;
          case 2:
            endTimeLabel.setText("Your Time: " + time + "\n" + endQuotes[rand.nextInt(3) + 2]);
            highscores.setText(
                "High Scores (seconds):\n1st: " + h[0] + " 2nd: *" + h[1] + "* 3rd:" + " " + h[2]
                    + "\nSession Best: " + sessionHigh);
            break;
          case 3:
            endTimeLabel.setText("Your Time: " + time + "\n" + endQuotes[rand.nextInt(3) + 2]);
            highscores.setText(
                "High Scores (seconds):\n1st: " + h[0] + " 2nd: " + h[1] + " 3rd: " + "*" + h[2]
                    + "*" + "\nSession Best: " + sessionHigh);
            break;
        }
        ArrayList<String> lines = new ArrayList<>();

        lines.add("Highscores: Best - Worst");
        lines.add("1st: " + h[0]);
        lines.add("2nd: " + h[1]);
        lines.add("3rd: " + h[2]);

        PrintStream write = new PrintStream(new File("Highscores.txt"));
        for (String s : lines) {
          write.println(s);
        }
      } else {
        if (time < 15) {
          endTimeLabel.setText("Your Time: " + time + "\n" + endQuotes[rand.nextInt(8) + 4]);
        } else if (time < 60) {
          endTimeLabel.setText("Your Time: " + time + "\n" + endQuotes[rand.nextInt(6) + 6]);
        }
        else {
          endTimeLabel.setText("Your Time: " + time + "\n" + endQuotes[12]);
        }

        highscores.setText(
            "High Scores (seconds):\n1st: " + h[0] + " 2nd: " + h[1] + " 3rd: " + h[2]
                + "\nSession Best: " + sessionHigh);
      }


    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void startGame() {
    gameLoop = new AnimationTimer() {

      double secondsPerFrame = 1d / 60d;
      double seconds = 0.0;

      @Override public void handle(long l) {
        moveParticles();
        moveCircles();
        checkBounds();
        if (gameStarted) {
          seconds += secondsPerFrame;
          timeLabel.setText("Time: " + Math.round(seconds * 10) / 10d);
        }
        if (score == 20) {
          particles.forEach((particle -> mainPane.getChildren().remove(particle.circle)));
	  //while (!particles.isEmpty()) moveParticles();
          writeScoreToHighScores(seconds);
          gameStarted = false;
          seconds = 0.0;
          if (!endGame.getChildren().contains(endTimeLabel) && !endGame.getChildren().contains(startGame)) {
            endGame.getChildren().addAll(endTimeLabel, startGame);
          }
          center.getChildren().add(endGame);
          gameLoop.stop();
        }
      }
    };

    gameLoop.start();
  }



  public static void main(String[] args) {
    Application.launch();
  }
}
