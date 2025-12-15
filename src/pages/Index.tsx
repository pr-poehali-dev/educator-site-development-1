import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [pollAnswer, setPollAnswer] = useState('');
  const [pollComment, setPollComment] = useState('');

  const gallery = [
    { id: 1, title: 'Праздник осени', image: 'https://cdn.poehali.dev/projects/72856814-469f-431a-a44e-d47166687aaa/files/b2d7bb03-cd79-400a-b102-d2ff9915adf2.jpg' },
    { id: 2, title: 'Творческие занятия', image: 'https://cdn.poehali.dev/projects/72856814-469f-431a-a44e-d47166687aaa/files/d4657625-b19f-4dde-aac9-13e8e04f9b2f.jpg' },
    { id: 3, title: 'День рождения', image: 'https://cdn.poehali.dev/projects/72856814-469f-431a-a44e-d47166687aaa/files/b2d7bb03-cd79-400a-b102-d2ff9915adf2.jpg' },
  ];

  const recommendations = [
    { id: 1, title: 'Развитие речи в домашних условиях', icon: 'MessageCircle', description: 'Разговаривайте с ребёнком о событиях дня, читайте книги вместе и задавайте вопросы по содержанию. Играйте в словесные игры.' },
    { id: 2, title: 'Режим дня и его важность', icon: 'Clock', description: 'Соблюдайте постоянный режим сна и бодрствования. Это помогает ребёнку чувствовать себя в безопасности и лучше адаптироваться.' },
    { id: 3, title: 'Подготовка к детскому саду', icon: 'Home', description: 'За несколько недель до начала посещения садика начните приучать ребёнка к режиму. Расскажите о садике позитивно.' },
    { id: 4, title: 'Развитие мелкой моторики', icon: 'Hand', description: 'Лепка, рисование, игры с конструктором развивают пальчики и готовят руку к письму. Уделяйте этому 15-20 минут ежедневно.' },
  ];

  const quizzes = [
    {
      id: 1,
      title: 'Загадка про животных',
      question: 'Кто зимой холодной ходит злой, голодный?',
      options: ['Заяц', 'Волк', 'Лиса', 'Медведь'],
      correct: 'Волк'
    },
    {
      id: 2,
      title: 'Цветовой ребус',
      question: 'Какой цвет получится, если смешать синий и жёлтый?',
      options: ['Красный', 'Зелёный', 'Фиолетовый', 'Оранжевый'],
      correct: 'Зелёный'
    },
    {
      id: 3,
      title: 'Считалочка',
      question: 'У кошки 4 лапы. Сколько лап у двух кошек?',
      options: ['4', '6', '8', '10'],
      correct: '8'
    }
  ];

  const handleQuizSubmit = (quizId: number) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz && quizAnswer === quiz.correct) {
      alert('🎉 Правильно! Молодец!');
    } else {
      alert('Попробуй ещё раз! Ты почти угадал!');
    }
  };

  const handlePollSubmit = () => {
    if (pollAnswer) {
      alert('Спасибо за участие в опросе! Ваше мнение очень важно для нас.');
      setPollAnswer('');
      setPollComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-lg">
              <img 
                src="https://cdn.poehali.dev/projects/72856814-469f-431a-a44e-d47166687aaa/files/73103622-ba46-4c76-a8a7-7cb5e79db51d.jpg" 
                alt="Воспитатель" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-2">Искендерова Татьяна Дмитриевна</h1>
          <p className="text-2xl text-primary font-semibold mb-4">Воспитатель</p>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Здесь вы найдёте фотографии наших событий, полезные рекомендации и развивающие игры для ваших детей
          </p>
        </header>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-auto gap-2">
            <TabsTrigger value="gallery" className="flex items-center gap-2 py-3 rounded-2xl">
              <Icon name="Image" size={20} />
              <span className="hidden sm:inline">Галерея</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2 py-3 rounded-2xl">
              <Icon name="BookOpen" size={20} />
              <span className="hidden sm:inline">Рекомендации</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2 py-3 rounded-2xl">
              <Icon name="Puzzle" size={20} />
              <span className="hidden sm:inline">Игры</span>
            </TabsTrigger>
            <TabsTrigger value="poll" className="flex items-center gap-2 py-3 rounded-2xl">
              <Icon name="MessageSquare" size={20} />
              <span className="hidden sm:inline">Опрос</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl border-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Camera" size={20} className="text-primary" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <Card 
                  key={rec.id}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl border-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl">
                        <Icon name={rec.icon as any} size={28} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{rec.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {rec.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="games" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz, index) => (
                <Card 
                  key={quiz.id}
                  className="hover:shadow-xl transition-all duration-300 rounded-3xl border-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <Badge className="w-fit mb-2 rounded-full">Тест #{quiz.id}</Badge>
                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-foreground mt-4">
                      {quiz.question}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={quizAnswer} onValueChange={setQuizAnswer}>
                      {quiz.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2 py-2">
                          <RadioGroupItem value={option} id={`${quiz.id}-${option}`} />
                          <Label htmlFor={`${quiz.id}-${option}`} className="cursor-pointer text-base">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button 
                      onClick={() => handleQuizSubmit(quiz.id)}
                      className="w-full mt-4 rounded-full"
                      disabled={!quizAnswer}
                    >
                      Проверить ответ
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="poll" className="animate-fade-in">
            <Card className="max-w-2xl mx-auto rounded-3xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Icon name="ClipboardList" size={28} className="text-primary" />
                  Опрос для родителей
                </CardTitle>
                <CardDescription className="text-base">
                  Ваше мнение помогает нам становиться лучше!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold mb-4 block">
                    Как вы оцениваете работу группы в этом месяце?
                  </Label>
                  <RadioGroup value={pollAnswer} onValueChange={setPollAnswer}>
                    {['Отлично', 'Хорошо', 'Удовлетворительно', 'Требует улучшения'].map((option) => (
                      <div key={option} className="flex items-center space-x-3 py-3">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer text-base">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="comment" className="text-lg font-semibold mb-2 block">
                    Комментарий или пожелания (необязательно)
                  </Label>
                  <Textarea 
                    id="comment"
                    placeholder="Поделитесь своими мыслями..."
                    value={pollComment}
                    onChange={(e) => setPollComment(e.target.value)}
                    className="min-h-32 rounded-2xl"
                  />
                </div>
                <Button 
                  onClick={handlePollSubmit}
                  className="w-full rounded-full text-lg py-6"
                  disabled={!pollAnswer}
                >
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить ответ
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;