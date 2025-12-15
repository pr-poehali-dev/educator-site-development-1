import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const GALLERY_API = 'https://functions.poehali.dev/ed774d34-7bc6-4846-8fbf-260121773d7b';

const Index = () => {
  const { toast } = useToast();
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [pollAnswer, setPollAnswer] = useState('');
  const [pollComment, setPollComment] = useState('');
  const [gallery, setGallery] = useState<Array<{id: number, title: string, image_url: string}>>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const response = await fetch(GALLERY_API);
      const data = await response.json();
      setGallery(data.photos || []);
    } catch (error) {
      console.error('Ошибка загрузки галереи:', error);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin2024') {
      setIsAdmin(true);
      setShowAdminDialog(false);
      toast({
        title: '✅ Успешный вход',
        description: 'Вы вошли в режим администратора'
      });
    } else {
      toast({
        title: '❌ Ошибка',
        description: 'Неверный пароль',
        variant: 'destructive'
      });
    }
  };

  const handlePhotoUpload = async () => {
    if (!newPhotoTitle || !newPhotoFile) {
      toast({
        title: '⚠️ Внимание',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        const response = await fetch(GALLERY_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Password': adminPassword
          },
          body: JSON.stringify({
            title: newPhotoTitle,
            image: base64
          })
        });

        const data = await response.json();

        if (response.ok) {
          toast({
            title: '✅ Успешно',
            description: 'Фотография добавлена в галерею'
          });
          setShowUploadDialog(false);
          setNewPhotoTitle('');
          setNewPhotoFile(null);
          loadGallery();
        } else {
          toast({
            title: '❌ Ошибка',
            description: data.error || 'Не удалось загрузить фото',
            variant: 'destructive'
          });
        }
      };
      reader.readAsDataURL(newPhotoFile);
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Произошла ошибка при загрузке',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoDelete = async (photoId: number) => {
    if (!confirm('Удалить эту фотографию?')) return;

    try {
      const response = await fetch(`${GALLERY_API}?id=${photoId}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Password': adminPassword
        }
      });

      if (response.ok) {
        toast({
          title: '✅ Удалено',
          description: 'Фотография удалена из галереи'
        });
        loadGallery();
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось удалить фото',
        variant: 'destructive'
      });
    }
  };

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
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl font-bold text-foreground">Искендерова Татьяна Дмитриевна</h1>
            {!isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAdminDialog(true)}
                className="hover:bg-primary/10"
              >
                <Icon name="Key" size={20} />
              </Button>
            )}
          </div>
          <p className="text-2xl text-primary font-semibold mb-4">Воспитатель высшей квалификационной категории</p>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Здесь вы найдёте фотографии наших событий, полезные рекомендации и развивающие игры для ваших детей
          </p>
        </header>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 h-auto gap-2">
            <TabsTrigger value="about" className="flex items-center gap-2 py-3 rounded-2xl">
              <Icon name="User" size={20} />
              <span className="hidden sm:inline">О воспитателе</span>
            </TabsTrigger>
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

          <TabsContent value="about" className="animate-fade-in">
            <Card className="max-w-4xl mx-auto rounded-3xl border-2">
              <CardContent className="pt-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-primary shadow-lg flex-shrink-0 mx-auto md:mx-0">
                    <img 
                      src="https://cdn.poehali.dev/projects/72856814-469f-431a-a44e-d47166687aaa/files/73103622-ba46-4c76-a8a7-7cb5e79db51d.jpg" 
                      alt="Искендерова Татьяна Дмитриевна" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground mb-2">Искендерова Татьяна Дмитриевна</h2>
                      <p className="text-xl text-primary font-semibold">Воспитатель высшей квалификационной категории</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary/50 rounded-xl mt-1">
                          <Icon name="GraduationCap" size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Образование</h3>
                          <p className="text-muted-foreground">Высшее педагогическое</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary/50 rounded-xl mt-1">
                          <Icon name="Briefcase" size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Стаж работы</h3>
                          <p className="text-muted-foreground">9 лет работы с детьми дошкольного возраста</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary/50 rounded-xl mt-1">
                          <Icon name="Heart" size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Подход к работе</h3>
                          <p className="text-muted-foreground">Индивидуальный подход к каждому ребёнку, создание атмосферы доверия и безопасности. Активное вовлечение родителей в образовательный процесс.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary/50 rounded-xl mt-1">
                          <Icon name="Award" size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Квалификация</h3>
                          <p className="text-muted-foreground">Высшая квалификационная категория. Постоянное повышение квалификации и участие в профессиональных конкурсах и семинарах.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="animate-fade-in">
            {isAdmin && (
              <div className="mb-6 flex justify-end">
                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                  <DialogTrigger asChild>
                    <Button className="rounded-full">
                      <Icon name="Plus" size={20} className="mr-2" />
                      Добавить фото
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-3xl">
                    <DialogHeader>
                      <DialogTitle>Загрузить фотографию</DialogTitle>
                      <DialogDescription>
                        Добавьте новую фотографию в галерею
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="photo-title">Название события</Label>
                        <Input
                          id="photo-title"
                          placeholder="Например: Праздник осени"
                          value={newPhotoTitle}
                          onChange={(e) => setNewPhotoTitle(e.target.value)}
                          className="rounded-2xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="photo-file">Фотография</Label>
                        <Input
                          id="photo-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewPhotoFile(e.target.files?.[0] || null)}
                          className="rounded-2xl"
                        />
                      </div>
                      <Button
                        onClick={handlePhotoUpload}
                        disabled={isUploading}
                        className="w-full rounded-full"
                      >
                        {isUploading ? 'Загрузка...' : 'Загрузить'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl border-2 relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon name="Camera" size={20} className="text-primary" />
                        {item.title}
                      </div>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePhotoDelete(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="Trash2" size={18} className="text-destructive" />
                        </Button>
                      )}
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

        <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>Вход для администратора</DialogTitle>
              <DialogDescription>
                Введите пароль для доступа к управлению галереей
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="admin-password">Пароль</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Введите пароль"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="rounded-2xl"
                />
              </div>
              <Button
                onClick={handleAdminLogin}
                className="w-full rounded-full"
              >
                Войти
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;